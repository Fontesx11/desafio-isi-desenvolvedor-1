import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { aguiasLineupEntriesMock, aguiasLineupDto, aguiasWithFormationMock, aguiasWithoutOttoLineupEntriesMock } from '../../../test/mocks/lineups.mock.js';
import { aguiasLineupMock } from '../../../test/mocks/matches.mock.js';
import { ClubsService } from '../clubes/clubs.service.js';
import { ClubFormation } from '../clubes/enums/clubs.enum.js';
import { LineupsService } from '../escalacoes/lineups.service.js';
import { PlayersService } from '../jogadores/players.service.js';
import { LeagueService } from './league.service.js';

describe('LeagueService', () => {
  let service: LeagueService;
  const manager = {};
  const clubsService = { find: vi.fn(), changeFormation: vi.fn(), calculateDynamicValues: vi.fn() };
  const playersService = { findOne: vi.fn() };
  const lineupsService = { findByClub: vi.fn(), replace: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeagueService,
        {
          provide: DataSource,
          useValue: {
            transaction: (work: (entityManager: typeof manager) => unknown) => work(manager),
          },
        },
        { provide: ClubsService, useValue: clubsService },
        { provide: PlayersService, useValue: playersService },
        { provide: LineupsService, useValue: lineupsService },
      ],
    }).compile();

    service = module.get(LeagueService);
  });

  it('sets the Águias FC lineup in 2-1-1 with the 5 starters', async () => {
    clubsService.find.mockResolvedValue(aguiasWithFormationMock);
    playersService.findOne.mockImplementation(({ id }: { id: number }) => aguiasLineupMock.players.find((player) => player.id === id));
    lineupsService.findByClub.mockResolvedValue(aguiasLineupEntriesMock);
    clubsService.calculateDynamicValues.mockReturnValue({ squad: aguiasLineupMock.players });

    const lineup = await service.updateLineup(1, aguiasLineupDto);

    expect(lineupsService.replace).toHaveBeenCalledWith(manager, 1, aguiasLineupDto.player_ids);
    expect(lineup.formation).toBe(ClubFormation.TWO_ONE_ONE);
    expect(lineup.complete).toBe(true);
    expect(lineup.players).toHaveLength(5);
  });

  it('keeps the 2-1-1 formation with 4 starters and incomplete after Otto Rangel is sold', async () => {
    clubsService.find.mockResolvedValue(aguiasWithFormationMock);
    lineupsService.findByClub.mockResolvedValue(aguiasWithoutOttoLineupEntriesMock);
    clubsService.calculateDynamicValues.mockReturnValue({ squad: aguiasLineupMock.players.filter((player) => player.id !== 34) });

    const lineup = await service.findLineup(1);

    expect(lineup.formation).toBe(ClubFormation.TWO_ONE_ONE);
    expect(lineup.complete).toBe(false);
    expect(lineup.players).toHaveLength(4);
  });
});
