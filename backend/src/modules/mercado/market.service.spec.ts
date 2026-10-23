import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { aguiasAfterPurchaseMock, aguiasMock } from '../../../test/mocks/clubs.mock.js';
import { meiaLuaContractMock } from '../../../test/mocks/contracts.mock.js';
import { meiaLuaBeforePurchaseMock, meiaLuaBeforeSaleMock } from '../../../test/mocks/players.mock.js';
import { ClubsService } from '../clubes/clubs.service.js';
import { Club } from '../clubes/entities/club.entity.js';
import { ContractsService } from '../contratos/contracts.service.js';
import { Contract } from '../contratos/entities/contract.entity.js';
import { LineupsService } from '../escalacoes/lineups.service.js';
import { PlayersService } from '../jogadores/players.service.js';
import { Transaction } from '../transacoes/entities/transaction.entity.js';
import { TransactionsService } from '../transacoes/transactions.service.js';
import { MarketService } from './market.service.js';

describe('MarketService', () => {
  let service: MarketService;
  let clubsRepository: Repository<Club>;
  let contractsRepository: Repository<Contract>;
  let transactionsRepository: Repository<Transaction>;
  const playersService = {
    findById: vi.fn(),
    assignToClub: vi.fn(),
    releaseFromClub: vi.fn(),
  };
  const manager = {
    create: (target: new () => object, data: object) => Object.assign(new target(), data),
    save: (entity: object) => entity,
    update: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketService,
        ClubsService,
        ContractsService,
        TransactionsService,
        { provide: getRepositoryToken(Club), useClass: Repository },
        { provide: getRepositoryToken(Contract), useClass: Repository },
        { provide: getRepositoryToken(Transaction), useClass: Repository },
        {
          provide: DataSource,
          useValue: {
            transaction: (work: (entityManager: typeof manager) => unknown) => work(manager),
          },
        },
        { provide: PlayersService, useValue: playersService },
        { provide: LineupsService, useValue: { removePlayer: vi.fn() } },
      ],
    }).compile();

    service = module.get(MarketService);
    clubsRepository = module.get(getRepositoryToken(Club));
    contractsRepository = module.get(getRepositoryToken(Contract));
    transactionsRepository = module.get(getRepositoryToken(Transaction));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('buys Meia Lua for 37.00 plus a 1.85 fee, leaving the cash at 261.15', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-02T10:15:00-03:00'));
    playersService.findById.mockResolvedValue(meiaLuaBeforePurchaseMock);
    vi.spyOn(clubsRepository, 'findOne').mockResolvedValue(aguiasMock);
    vi.spyOn(transactionsRepository, 'existsBy').mockResolvedValue(false);

    const purchase = await service.buyPlayer(2, {
      club_id: 1,
      loyalty_until: '2027-03-02T10:15-03:00',
    });

    expect(purchase.transaction).toMatchObject({
      value: '37.00',
      fee: '1.85',
      cashChange: '-38.85',
    });
    expect(purchase.clubCash).toBe('261.15');
  });

  it('sells Meia Lua for 40.00 with 117 days left, crediting 35.70 and leaving the cash at 296.85', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-05T16:40:00-03:00'));
    playersService.findById.mockResolvedValue(meiaLuaBeforeSaleMock);
    vi.spyOn(clubsRepository, 'findOne').mockResolvedValue(aguiasAfterPurchaseMock);
    vi.spyOn(contractsRepository, 'findOneBy').mockResolvedValue(meiaLuaContractMock);

    const sale = await service.sellPlayer(2);

    expect(sale.transaction).toMatchObject({
      value: '40.00',
      fee: '0.30',
      penalty: '4.00',
      profit: '3.00',
      cashChange: '35.70',
    });
    expect(sale.remainingDays).toBe(117);
    expect(sale.clubCash).toBe('296.85');
  });

  describe('calculatePurchaseFeeCents', () => {
    it.each([
      [3000, 0],
      [3001, 150],
      [3700, 185],
    ])('%i -> %i', (marketValueCents, expected) => {
      expect(service.calculatePurchaseFeeCents(marketValueCents)).toBe(expected);
    });
  });

  describe('calculatePenaltyCents', () => {
    it.each([
      [4000, 10, 400],
      [20000, 20, 1000],
    ])('%i at %i%% -> %i', (marketValueCents, penaltyRate, expected) => {
      expect(service.calculatePenaltyCents(marketValueCents, penaltyRate)).toBe(expected);
    });
  });

  describe('calculateCommissionCents', () => {
    it.each([
      [-100, 0],
      [0, 0],
      [385, 39],
      [1000, 100],
      [1500, 200],
    ])('profit %i -> %i', (profitCents, expected) => {
      expect(service.calculateCommissionCents(profitCents)).toBe(expected);
    });
  });
});
