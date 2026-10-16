import type { Standing } from '../types/standings.types';

type StandingRow = [
  position: number,
  clubId: number,
  clubName: string,
  played: number,
  wins: number,
  draws: number,
  losses: number,
  goalsFor: number,
  goalsAgainst: number,
  goalDifference: number,
  points: number,
];

// prettier-ignore
const ROWS: StandingRow[] = [
  [1, 2, 'Delta FC', 2, 2, 0, 0, 4, 2, 2, 6],
  [2, 3, 'Épsilon EC', 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 4, 'Gama SC', 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 5, 'Mangue FC', 0, 0, 0, 0, 0, 0, 0, 0],
  [5, 6, 'Tubarões EC', 0, 0, 0, 0, 0, 0, 0, 0],
  [6, 1, 'Águias FC', 2, 0, 0, 2, 2, 4, -2, 0],
];

export const STANDINGS_MOCK: Standing[] = ROWS.map(
  ([
    position,
    clubId,
    clubName,
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference,
    points,
  ]) => ({
    position,
    club_id: clubId,
    club_name: clubName,
    played,
    wins,
    draws,
    losses,
    goals_for: goalsFor,
    goals_against: goalsAgainst,
    goal_difference: goalDifference,
    points,
  }),
);
