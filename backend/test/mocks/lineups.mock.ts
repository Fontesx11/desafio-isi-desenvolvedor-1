import { ClubFormation } from '../../src/modules/clubes/enums/clubs.enum.js';
import { Lineup } from '../../src/modules/escalacoes/entities/lineup.entity.js';
import { UpdateLineupDto } from '../../src/modules/liga/dtos/update-lineup.dto.js';
import { aguiasMock } from './clubs.mock.js';

export const aguiasLineupDto: UpdateLineupDto = {
  formation: ClubFormation.TWO_ONE_ONE,
  player_ids: [34, 31, 30, 33, 32],
};

export const aguiasWithFormationMock = {
  ...aguiasMock,
  formation: ClubFormation.TWO_ONE_ONE,
};

export const aguiasLineupEntriesMock: Lineup[] = [
  { clubId: 1, playerId: 30, createdAt: new Date('2026-11-09T09:00:00-03:00') },
  { clubId: 1, playerId: 31, createdAt: new Date('2026-11-09T09:00:00-03:00') },
  { clubId: 1, playerId: 32, createdAt: new Date('2026-11-09T09:00:00-03:00') },
  { clubId: 1, playerId: 33, createdAt: new Date('2026-11-09T09:00:00-03:00') },
  { clubId: 1, playerId: 34, createdAt: new Date('2026-11-09T09:00:00-03:00') },
];

export const aguiasWithoutOttoLineupEntriesMock: Lineup[] = aguiasLineupEntriesMock.filter((entry) => entry.playerId !== 34);
