import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { roundDivision } from '../../core/utils/math.utils.js';
import { ClubsService } from '../clubes/clubs.service.js';
import {
  ContractsService,
  CreateContractData,
} from '../contratos/contracts.service.js';
import { PlayersService } from '../jogadores/players.service.js';
import { TransactionType } from '../transacoes/enums/transactions.enum.js';
import {
  CreateTransactionData,
  TransactionsService,
} from '../transacoes/transactions.service.js';
import { BuyPlayerDto } from './dtos/buy-player.dto.js';
import { Purchase } from './dtos/purchase-response.dto.js';

const PURCHASE_FEE_PERCENT = 5;
const PURCHASE_FEE_MIN_VALUE_CENTS = 3000;

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

    let feeCents = 0;
    const marketValueCents = Math.round(player.marketValue * 100);

    if (marketValueCents > PURCHASE_FEE_MIN_VALUE_CENTS) {
      feeCents = roundDivision(marketValueCents * PURCHASE_FEE_PERCENT, 100);
    }

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
      const clubCash = await this.clubsService.debitCash(
        manager,
        club,
        totalCostCents,
      );
      const transaction = await this.transactionsService.create(
        manager,
        transactionData,
      );

      return { transaction, contract, clubCash };
    });
  }
}
