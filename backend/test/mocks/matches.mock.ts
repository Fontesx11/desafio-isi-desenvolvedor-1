import { Club } from '../../src/modules/clubes/entities/club.entity.js';
import { ClubFormation } from '../../src/modules/clubes/enums/clubs.enum.js';
import {
  PlayerCondition,
  PlayerPosition,
} from '../../src/modules/jogadores/enums/players.enum.js';
import { ClubLineup } from '../../src/modules/liga/interfaces/lineup.interface.js';
import { Match } from '../../src/modules/partidas/entities/match.entity.js';
import { aguiasMock } from './clubs.mock.js';
import { meiaLuaBeforeSaleMock } from './players.mock.js';

const { GOL, ZAG, LAT, MEI, ATA } = PlayerPosition;

// prettier-ignore
export const aguiasLineupMock: ClubLineup = {
  clubId: 1,
  formation: ClubFormation.TWO_ONE_ONE,
  complete: true,
  players: [
    { ...meiaLuaBeforeSaleMock, id: 30, name: 'Rui Prado', position: GOL, defending: 77 },
    { ...meiaLuaBeforeSaleMock, id: 32, name: 'Téo Brandão', position: ZAG, defending: 84 },
    { ...meiaLuaBeforeSaleMock, id: 31, name: 'Davi Lins', position: LAT, dribbling: 74, defending: 66, condition: PlayerCondition.MAL_CONDICIONADO },
    { ...meiaLuaBeforeSaleMock, id: 33, name: 'Lauro Neves', position: MEI, passing: 82 },
    { ...meiaLuaBeforeSaleMock, id: 34, name: 'Otto Rangel', position: ATA, shooting: 75 },
  ],
};

// prettier-ignore
export const deltaLineupMock: ClubLineup = {
  clubId: 2,
  formation: ClubFormation.TWO_ONE_ONE,
  complete: true,
  players: [
    { ...meiaLuaBeforeSaleMock, id: 40, clubId: 2, name: 'Ivo Teles', position: GOL, defending: 72 },
    { ...meiaLuaBeforeSaleMock, id: 41, clubId: 2, name: 'Hugo Vaz', position: ZAG, defending: 84 },
    { ...meiaLuaBeforeSaleMock, id: 42, clubId: 2, name: 'Lino Matos', position: LAT, dribbling: 79, defending: 63 },
    { ...meiaLuaBeforeSaleMock, id: 43, clubId: 2, name: 'Nei Soares', position: MEI, passing: 70 },
    { ...meiaLuaBeforeSaleMock, id: 44, clubId: 2, name: 'Ugo Falcão', position: ATA, shooting: 81 },
  ],
};

// prettier-ignore
export const standingsClubsMock: Club[] = [
  aguiasMock,
  { ...aguiasMock, id: 2, name: 'Delta FC' },
  { ...aguiasMock, id: 3, name: 'Gama SC' },
  { ...aguiasMock, id: 4, name: 'Épsilon EC' },
  { ...aguiasMock, id: 5, name: 'Tubarões EC' },
  { ...aguiasMock, id: 6, name: 'Mangue FC' },
];

export const aguiasDeltaMatchMock: Match = {
  id: 1,
  homeClubId: 1,
  awayClubId: 2,
  homeGoals: 1,
  awayGoals: 2,
  homeFormation: ClubFormation.TWO_ONE_ONE,
  awayFormation: ClubFormation.TWO_ONE_ONE,
  playedAt: new Date('2026-11-10T20:00:00-03:00'),
  homeClub: standingsClubsMock[0],
  awayClub: standingsClubsMock[1],
};

// prettier-ignore
export const standingsMatchesMock: Match[] = [
  aguiasDeltaMatchMock,
  { ...aguiasDeltaMatchMock, id: 2, homeClubId: 3, awayClubId: 4, homeGoals: 2, awayGoals: 1, homeClub: standingsClubsMock[2], awayClub: standingsClubsMock[3] },
  { ...aguiasDeltaMatchMock, id: 3, homeClubId: 4, awayClubId: 1, homeGoals: 3, awayGoals: 2, homeClub: standingsClubsMock[3], awayClub: standingsClubsMock[0] },
  { ...aguiasDeltaMatchMock, id: 4, homeClubId: 2, awayClubId: 3, homeGoals: 0, awayGoals: 1, homeClub: standingsClubsMock[1], awayClub: standingsClubsMock[2] },
];
