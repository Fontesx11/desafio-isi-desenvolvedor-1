import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Mock } from 'vitest';
import { buildClub } from '../../../test/mocks/clubs.mock.js';
import { buildContract } from '../../../test/mocks/contracts.mock.js';
import { buildPlayer } from '../../../test/mocks/players.mock.js';
import { ContractsService } from '../contratos/contracts.service.js';
import { Contract } from '../contratos/entities/contract.entity.js';
import {
  PlayerCondition,
  PlayerPosition,
} from '../jogadores/enums/players.enum.js';
import { ClubsService } from './clubs.service.js';
import { Club } from './entities/club.entity.js';

const meiaLua = buildPlayer({
  condition: PlayerCondition.MAL_CONDICIONADO,
  clubId: 1,
});

describe('ClubsService', () => {
  let service: ClubsService;
  let nameQuery: { where: Mock; getExists: Mock };
  let clubsRepository: {
    count: Mock;
    createQueryBuilder: Mock;
    existsBy: Mock;
    create: Mock;
    save: Mock;
    findOne: Mock;
  };
  let contractsRepository: { findBy: Mock };

  beforeEach(async () => {
    nameQuery = {
      where: vi.fn().mockReturnThis(),
      getExists: vi.fn(),
    };
    clubsRepository = {
      count: vi.fn(),
      createQueryBuilder: vi.fn(() => nameQuery),
      existsBy: vi.fn(),
      create: vi.fn((data: Partial<Club>) => Object.assign(new Club(), data)),
      save: vi.fn(),
      findOne: vi.fn(),
    };
    contractsRepository = { findBy: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubsService,
        ContractsService,
        { provide: getRepositoryToken(Club), useValue: clubsRepository },
        {
          provide: getRepositoryToken(Contract),
          useValue: contractsRepository,
        },
      ],
    }).compile();

    service = module.get(ClubsService);
  });

  describe('create', () => {
    beforeEach(() => {
      clubsRepository.count.mockResolvedValue(0);
      nameQuery.getExists.mockResolvedValue(false);
      clubsRepository.existsBy.mockResolvedValue(false);
    });

    it('creates Águias FC with 300.00 cash, squad value 0.00 and net worth 300.00 (README 2.2.1)', async () => {
      const club = await service.create({ name: 'Águias FC', acronym: 'AGU' });

      expect(club.cash).toBe('300.00');
      expect(club.squadValue).toBe(0);
      expect(club.netWorth).toBe(300);
      expect(club.squad).toEqual([]);
      expect(clubsRepository.save).toHaveBeenCalledOnce();
    });

    it('accepts the 20th club', async () => {
      clubsRepository.count.mockResolvedValue(19);

      await service.create({ name: 'Águias FC', acronym: 'AGU' });

      expect(clubsRepository.save).toHaveBeenCalledOnce();
    });

    it('rejects the 21st club with 409, without saving (RN10)', async () => {
      clubsRepository.count.mockResolvedValue(20);

      await expect(
        service.create({ name: 'Águias FC', acronym: 'AGU' }),
      ).rejects.toThrow(ConflictException);
      expect(clubsRepository.save).not.toHaveBeenCalled();
    });

    it('rejects a name already taken with 409, without saving (RN10)', async () => {
      nameQuery.getExists.mockResolvedValue(true);

      await expect(
        service.create({ name: 'Águias FC', acronym: 'AGU' }),
      ).rejects.toThrow(ConflictException);
      expect(clubsRepository.save).not.toHaveBeenCalled();
    });

    it('rejects an acronym already taken with 409, without saving (RN10)', async () => {
      clubsRepository.existsBy.mockResolvedValue(true);

      await expect(
        service.create({ name: 'Aguias FC', acronym: 'AGU' }),
      ).rejects.toThrow(ConflictException);
      expect(clubsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('responds 404 for a club that does not exist', async () => {
      clubsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne({ id: 999 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('calculateDynamicValues', () => {
    it('orders the squad by position and adds up the purchase sequence of the ficha (B13)', () => {
      const club = service.calculateDynamicValues(
        buildClub({
          cash: '137.63',
          players: [
            buildPlayer({
              id: 3,
              position: PlayerPosition.MEI,
              baseValue: '46.00',
            }),
            buildPlayer({
              id: 4,
              position: PlayerPosition.ATA,
              baseValue: '1.00',
            }),
            buildPlayer({
              id: 1,
              position: PlayerPosition.GOL,
              baseValue: '81.40',
            }),
            buildPlayer({
              id: 2,
              position: PlayerPosition.ZAG,
              baseValue: '27.60',
            }),
          ],
        }),
      );

      expect(club.squad.map((player) => player.position)).toEqual([
        PlayerPosition.GOL,
        PlayerPosition.ZAG,
        PlayerPosition.MEI,
        PlayerPosition.ATA,
      ]);
      expect(club.squadValue).toBe(156);
      expect(club.netWorth).toBe(293.63);
    });
  });

  describe('findById', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('shows the contract with 120 remaining days and 10% penalty right after the purchase (README 2.2.2)', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-11-02T10:15:00-03:00'));
      clubsRepository.findOne.mockResolvedValue(
        buildClub({ cash: '261.15', players: [meiaLua] }),
      );
      contractsRepository.findBy.mockResolvedValue([buildContract()]);

      const { club, squad } = await service.findById(1);

      expect(club.squadValue).toBe(37);
      expect(club.netWorth).toBe(298.15);
      expect(squad[0].contract).toEqual({
        purchaseValue: '37.00',
        loyaltyUntil: new Date('2027-03-02T10:15:00-03:00'),
        remainingDays: 120,
        penaltyRate: 10,
      });
    });
  });

  describe('assertCanBuy', () => {
    it.each([
      ['261.15', 13057],
      ['100.00', 5000],
    ])(
      'accepts a cost of up to half of the cash (cash %s, cost %i cents)',
      (cash, totalCostCents) => {
        expect(() =>
          service.assertCanBuy(buildClub({ cash }), totalCostCents),
        ).not.toThrow();
      },
    );

    it.each([
      ['261.15', 13058],
      ['100.00', 5040],
    ])(
      'rejects a cost above half of the cash, without rounding the limit (cash %s, cost %i cents)',
      (cash, totalCostCents) => {
        expect(() =>
          service.assertCanBuy(buildClub({ cash }), totalCostCents),
        ).toThrow(ConflictException);
      },
    );

    it('accepts the 12th player and rejects the 13th (RN14)', () => {
      const squad = (size: number) =>
        Array.from({ length: size }, (_, index) =>
          buildPlayer({ id: index + 1, clubId: 1 }),
        );

      expect(() =>
        service.assertCanBuy(buildClub({ players: squad(11) }), 100),
      ).not.toThrow();
      expect(() =>
        service.assertCanBuy(buildClub({ players: squad(12) }), 100),
      ).toThrow(ConflictException);
    });
  });
});
