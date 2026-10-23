import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { aguiasAfterPurchaseMock, aguiasDto, aguiasMock, listClubsQueryMock } from '../../../test/mocks/clubs.mock.js';
import { meiaLuaContractMock } from '../../../test/mocks/contracts.mock.js';
import { ContractsService } from '../contratos/contracts.service.js';
import { Contract } from '../contratos/entities/contract.entity.js';
import { ClubsService } from './clubs.service.js';
import { Club } from './entities/club.entity.js';

describe('ClubsService', () => {
  let service: ClubsService;
  let clubsRepository: Repository<Club>;
  let contractsRepository: Repository<Contract>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubsService,
        ContractsService,
        { provide: getRepositoryToken(Club), useClass: Repository },
        { provide: getRepositoryToken(Contract), useClass: Repository },
      ],
    }).compile();

    service = module.get(ClubsService);
    clubsRepository = module.get(getRepositoryToken(Club));
    contractsRepository = module.get(getRepositoryToken(Contract));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates Águias FC with cash 300.00, squad value 0.00 and net worth 300.00', async () => {
    vi.spyOn(clubsRepository, 'count').mockResolvedValue(0);
    vi.spyOn(clubsRepository, 'createQueryBuilder').mockReturnValue({
      where: () => ({ getExists: () => Promise.resolve(false) }),
    } as never);
    vi.spyOn(clubsRepository, 'existsBy').mockResolvedValue(false);
    vi.spyOn(clubsRepository, 'create').mockReturnValue({ ...aguiasMock });
    vi.spyOn(clubsRepository, 'save').mockResolvedValue(aguiasMock);

    const club = await service.create(aguiasDto);

    expect(clubsRepository.create).toHaveBeenCalledWith(expect.objectContaining({ cash: '300.00' }));
    expect(club.squadValue).toBe(0);
    expect(club.netWorth).toBe(300);
  });

  it('lists Águias FC with squad value 37.00 and net worth 298.15', async () => {
    vi.spyOn(clubsRepository, 'find').mockResolvedValue([aguiasAfterPurchaseMock]);

    const clubs = await service.findAll(listClubsQueryMock);

    expect(clubs).toEqual([expect.objectContaining({ id: 1, squadValue: 37, netWorth: 298.15 })]);
  });

  it('shows Águias FC with squad value 37.00, net worth 298.15 and the contract with 120 days and 10% penalty right after the purchase', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-02T10:15:00-03:00'));
    vi.spyOn(clubsRepository, 'findOne').mockResolvedValue(aguiasAfterPurchaseMock);
    vi.spyOn(contractsRepository, 'findBy').mockResolvedValue([meiaLuaContractMock]);

    const { club, squad } = await service.findById(1);

    expect(club.squadValue).toBe(37);
    expect(club.netWorth).toBe(298.15);
    expect(squad[0].contract).toMatchObject({
      remainingDays: 120,
      penaltyRate: 10,
    });
  });

  it('lets Águias FC spend exactly 50% of the cash and refuses one cent more', () => {
    expect(() => service.assertCanBuy(aguiasMock, 15000)).not.toThrow();
    expect(() => service.assertCanBuy(aguiasMock, 15001)).toThrow(ConflictException);
  });
});
