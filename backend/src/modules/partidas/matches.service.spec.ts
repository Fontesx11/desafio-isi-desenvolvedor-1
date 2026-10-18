import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  aguiasDeltaMatchMock,
  aguiasLineupMock,
  deltaLineupMock,
  standingsClubsMock,
  standingsMatchesMock,
} from '../../../test/mocks/matches.mock.js';
import { ClubsService } from '../clubes/clubs.service.js';
import { LeagueService } from '../liga/league.service.js';
import { MatchDuel } from './entities/match-duel.entity.js';
import { Match } from './entities/match.entity.js';
import { MatchesService } from './matches.service.js';

describe('MatchesService', () => {
  let service: MatchesService;
  let matchesRepository: Repository<Match>;
  let matchDuelsRepository: Repository<MatchDuel>;
  const clubsService = { find: vi.fn() };
  const leagueService = { findLineup: vi.fn() };
  const manager = {
    create: (target: new () => object, data: object) =>
      Object.assign(new target(), data),
    save: vi.fn((entity: object) => entity),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: getRepositoryToken(Match), useClass: Repository },
        { provide: getRepositoryToken(MatchDuel), useClass: Repository },
        {
          provide: DataSource,
          useValue: {
            transaction: (work: (entityManager: typeof manager) => unknown) =>
              work(manager),
          },
        },
        { provide: ClubsService, useValue: clubsService },
        { provide: LeagueService, useValue: leagueService },
      ],
    }).compile();

    service = module.get(MatchesService);
    matchesRepository = module.get(getRepositoryToken(Match));
    matchDuelsRepository = module.get(getRepositoryToken(MatchDuel));
  });

  it('plays Águias FC 1 x 2 Delta FC with the 6 duels', async () => {
    leagueService.findLineup
      .mockResolvedValueOnce(aguiasLineupMock)
      .mockResolvedValueOnce(deltaLineupMock);
    vi.spyOn(matchesRepository, 'findOne').mockResolvedValue(
      aguiasDeltaMatchMock,
    );
    vi.spyOn(matchDuelsRepository, 'find').mockResolvedValue([]);

    await service.playMatch({ home_club_id: 1, away_club_id: 2 });

    const [[match], [duels]] = manager.save.mock.calls;
    expect(match).toMatchObject({ homeGoals: 1, awayGoals: 2 });
    // prettier-ignore
    expect(duels).toMatchObject([
      { attackerId: 34, attackValue: 75, defenderId: 40, defenseValue: 72, goal: true },
      { attackerId: 33, attackValue: 82, defenderId: 41, defenseValue: 84, goal: false },
      { attackerId: 31, attackValue: 63, defenderId: 42, defenseValue: 63, goal: false },
      { attackerId: 44, attackValue: 81, defenderId: 30, defenseValue: 77, goal: true },
      { attackerId: 43, attackValue: 70, defenderId: 32, defenseValue: 84, goal: false },
      { attackerId: 42, attackValue: 79, defenderId: 31, defenseValue: 56, goal: true },
    ]);
  });

  it('orders the 6 clubs by points, goal difference, goals for and name', async () => {
    clubsService.find.mockResolvedValue(standingsClubsMock);
    vi.spyOn(matchesRepository, 'find').mockResolvedValue(standingsMatchesMock);

    const standings = await service.calculateStandings();

    expect(standings.map((club) => [club.clubName, club.points])).toEqual([
      ['Gama SC', 6],
      ['Épsilon EC', 3],
      ['Delta FC', 3],
      ['Mangue FC', 0],
      ['Tubarões EC', 0],
      ['Águias FC', 0],
    ]);
  });
});
