import type { DuelAttribute, MatchResult } from '../types/matches.types';

export const RESULT_LABELS: Record<MatchResult, string> = {
  MANDANTE: 'Vitória do mandante',
  VISITANTE: 'Vitória do visitante',
  EMPATE: 'Empate',
};

export const DUEL_ATTRIBUTE_LABELS: Record<DuelAttribute, string> = {
  shooting: 'Finalização',
  passing: 'Passe',
  dribbling: 'Drible',
  defending: 'Defesa',
};
