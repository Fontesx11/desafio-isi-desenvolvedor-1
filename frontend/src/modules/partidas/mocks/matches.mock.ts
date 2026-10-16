import type { Duel, DuelPlayer, Match } from '../types/matches.types';

const DELTA = { club_id: 2, club_name: 'Delta FC', formation: '2-1-1' };
const AGUIAS = { club_id: 1, club_name: 'Águias FC', formation: '2-1-1' };

export const MATCHES_MOCK: Match[] = [
  {
    id: 2,
    played_at: '2026-11-11T20:00:00-03:00',
    home: { ...DELTA, goals: 2 },
    away: { ...AGUIAS, goals: 1 },
    result: 'MANDANTE',
  },
  {
    id: 1,
    played_at: '2026-11-10T20:00:00-03:00',
    home: { ...AGUIAS, goals: 1 },
    away: { ...DELTA, goals: 2 },
    result: 'VISITANTE',
  },
];

type DuelRow = [
  order: number,
  attackingClubId: number,
  attacker: DuelPlayer,
  defender: DuelPlayer,
  goal: boolean,
];

function duelPlayer(
  playerId: number,
  playerName: string,
  position: DuelPlayer['position'],
  condition: DuelPlayer['condition'],
  attribute: DuelPlayer['attribute'],
  value: number,
): DuelPlayer {
  return {
    player_id: playerId,
    player_name: playerName,
    position,
    condition,
    attribute,
    value,
  };
}

// prettier-ignore
const DUEL_ROWS: DuelRow[] = [
  [1, 2, duelPlayer(8, 'Gabriel Antunes', 'ATA', 'APTO', 'shooting', 81), duelPlayer(2, 'Bruno Tavares', 'GOL', 'APTO', 'defending', 77), true],
  [2, 2, duelPlayer(26, 'Meia Lua', 'MEI', 'APTO', 'passing', 82), duelPlayer(7, 'Felipe Moura', 'ZAG', 'APTO', 'defending', 83), false],
  [3, 2, duelPlayer(27, 'Kauã Ribeiro', 'LAT', 'APTO', 'dribbling', 75), duelPlayer(4, 'Diego Ramos', 'LAT', 'MAL_CONDICIONADO', 'defending', 56), true],
  [4, 1, duelPlayer(11, 'João Silva', 'ATA', 'APTO', 'shooting', 79), duelPlayer(1, 'André Lacerda', 'GOL', 'APTO', 'defending', 74), true],
  [5, 1, duelPlayer(25, 'Sávio Lima', 'MEI', 'MAL_CONDICIONADO', 'passing', 60), duelPlayer(3, 'Danilo Freitas', 'ZAG', 'MAL_CONDICIONADO', 'defending', 67), false],
  [6, 1, duelPlayer(4, 'Diego Ramos', 'LAT', 'MAL_CONDICIONADO', 'dribbling', 63), duelPlayer(27, 'Kauã Ribeiro', 'LAT', 'APTO', 'defending', 63), false],
];

const DUELS: Duel[] = DUEL_ROWS.map(
  ([order, attackingClubId, attacker, defender, goal]) => ({
    order,
    attacking_club_id: attackingClubId,
    attacker,
    defender,
    goal,
  }),
);

// simulacao
export function findMatchMock(matchId: number): Match {
  const match =
    MATCHES_MOCK.find((item) => item.id === matchId) ?? MATCHES_MOCK[0];
  return { ...match, duels: DUELS };
}
