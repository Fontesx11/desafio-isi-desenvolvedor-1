import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { roundDivision } from '../../core/utils/math.utils.js';
import { ClubsService } from '../clubes/clubs.service.js';
import {
  ContractsService,
  CreateContractData,
} from '../contratos/contracts.service.js';
import { ContractStatus } from '../contratos/enums/contracts.enum.js';
import { PlayersService } from '../jogadores/players.service.js';
import { TransactionType } from '../transacoes/enums/transactions.enum.js';
import {
  CreateTransactionData,
  TransactionsService,
} from '../transacoes/transactions.service.js';
import { BuyPlayerDto } from './dtos/buy-player.dto.js';
import { Purchase } from './dtos/purchase-response.dto.js';
import { Sale } from './dtos/sale-response.dto.js';

const PURCHASE_FEE_PERCENT = 5;
const PURCHASE_FEE_MIN_VALUE_CENTS = 3000;
const PENALTY_CAP_CENTS = 1000;
const COMMISSION_FIRST_TIER_LIMIT_CENTS = 1000;
const COMMISSION_FIRST_TIER_PERCENT = 10;
const COMMISSION_SECOND_TIER_PERCENT = 20;

@Injectable()
export class MarketService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly playersService: PlayersService,
    private readonly clubsService: ClubsService,
    private readonly contractsService: ContractsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async buyPlayer(id: number, dto: BuyPlayerDto): Promise<Purchase> {
    const player = await this.playersService.findById(id);
    const club = await this.clubsService.findOne(
      { id: dto.club_id },
      { players: true },
    );

    if (player.clubId !== null) {
      throw new ConflictException('the player already has a club');
    }

    const clubSoldPlayer = await this.transactionsService.hasSale(
      club.id,
      player.id,
    );

    if (clubSoldPlayer) {
      throw new ConflictException('the club cannot buy back a player it sold');
    }

    const marketValueCents = Math.round(player.marketValue * 100);
    const feeCents = this.calculatePurchaseFeeCents(marketValueCents);
    const totalCostCents = marketValueCents + feeCents;

    this.clubsService.assertCanBuy(club, totalCostCents);

    const contractData: CreateContractData = {
      playerId: player.id,
      clubId: club.id,
      purchaseValue: (marketValueCents / 100).toFixed(2),
      loyaltyUntil: new Date(dto.loyalty_until),
    };

    const transactionData: CreateTransactionData = {
      clubId: club.id,
      playerId: player.id,
      playerName: player.name,
      type: TransactionType.COMPRA,
      value: (marketValueCents / 100).toFixed(2),
      fee: (feeCents / 100).toFixed(2),
      penalty: '0.00',
      profit: null,
      cashChange: (-totalCostCents / 100).toFixed(2),
    };

    return this.dataSource.transaction(async (manager) => {
      const contract = await this.contractsService.create(
        manager,
        contractData,
      );
      await this.playersService.assignToClub(manager, player.id, club.id);
      const clubCash = await this.clubsService.changeCash(
        manager,
        club,
        -totalCostCents,
      );
      const transaction = await this.transactionsService.create(
        manager,
        transactionData,
      );

      return { transaction, contract, clubCash };
    });
  }

  async sellPlayer(id: number): Promise<Sale> {
    const player = await this.playersService.findById(id);

    if (player.clubId === null) {
      throw new ConflictException('the player has no club');
    }

    const club = await this.clubsService.findOne({ id: player.clubId });
    const contract = await this.contractsService.findActiveByPlayer(player.id);
    const now = new Date();
    const { remainingDays, penaltyRate } =
      this.contractsService.calculateContractSummary(contract, now);

    const marketValueCents = Math.round(player.marketValue * 100);
    const purchaseValueCents = Math.round(Number(contract.purchaseValue) * 100);
    const profitCents = marketValueCents - purchaseValueCents;

    const penaltyCents = this.calculatePenaltyCents(
      marketValueCents,
      penaltyRate,
    );
    const commissionCents = this.calculateCommissionCents(profitCents);
    const creditCents = marketValueCents - penaltyCents - commissionCents;

    let contractStatus = ContractStatus.ENCERRADO;

    if (penaltyCents > 0) {
      contractStatus = ContractStatus.RESCINDIDO;
    }

    const transactionData: CreateTransactionData = {
      clubId: club.id,
      playerId: player.id,
      playerName: player.name,
      type: TransactionType.VENDA,
      value: (marketValueCents / 100).toFixed(2),
      fee: (commissionCents / 100).toFixed(2),
      penalty: (penaltyCents / 100).toFixed(2),
      profit: (profitCents / 100).toFixed(2),
      cashChange: (creditCents / 100).toFixed(2),
    };

    return this.dataSource.transaction(async (manager) => {
      const clubCash = await this.clubsService.changeCash(
        manager,
        club,
        creditCents,
      );
      await this.playersService.releaseFromClub(manager, player.id);
      await this.contractsService.close(manager, contract, contractStatus, now);
      const transaction = await this.transactionsService.create(
        manager,
        transactionData,
      );

      return {
        transaction,
        purchaseValue: contract.purchaseValue,
        remainingDays,
        penaltyRate,
        contractStatus,
        clubCash,
      };
    });
  }

  calculatePurchaseFeeCents(marketValueCents: number): number {
    if (marketValueCents <= PURCHASE_FEE_MIN_VALUE_CENTS) return 0;

    return roundDivision(marketValueCents * PURCHASE_FEE_PERCENT, 100);
  }

  calculatePenaltyCents(marketValueCents: number, penaltyRate: number): number {
    const penaltyCents = roundDivision(marketValueCents * penaltyRate, 100);

    return Math.min(penaltyCents, PENALTY_CAP_CENTS);
  }

  calculateCommissionCents(profitCents: number): number {
    if (profitCents <= 0) return 0;

    const profitInFirstTierCents = Math.min(
      profitCents,
      COMMISSION_FIRST_TIER_LIMIT_CENTS,
    );
    const profitInSecondTierCents = profitCents - profitInFirstTierCents;

    const firstTierCommission =
      profitInFirstTierCents * COMMISSION_FIRST_TIER_PERCENT;
    const secondTierCommission =
      profitInSecondTierCents * COMMISSION_SECOND_TIER_PERCENT;

    return roundDivision(firstTierCommission + secondTierCommission, 100);
  }
}
