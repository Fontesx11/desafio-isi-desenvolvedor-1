import type { Match } from '../types/matches.types';

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
