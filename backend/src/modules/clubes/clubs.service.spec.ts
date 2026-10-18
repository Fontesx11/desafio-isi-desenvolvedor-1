import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { aguiasAfterPurchaseMock } from '../../../test/mocks/clubs.mock.js';
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
});
