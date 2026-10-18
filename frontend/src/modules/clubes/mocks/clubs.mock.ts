import { toPlayer } from '@/modules/jogadores/mocks/players.mock';
import type {
  Club,
  Formation,
  PlayerContract,
  SquadPlayer,
} from '../types/clubs.types';

// prettier-ignore
export const CLUBS_MOCK: Club[] = [
  { id: 1, name: 'Águias FC', acronym: 'AGU', cash: 51.58, squad_value: 222.68, net_worth: 274.26 },
  { id: 2, name: 'Delta FC', acronym: 'DEL', cash: 91.85, squad_value: 200.76, net_worth: 292.61 },
  { id: 3, name: 'Épsilon EC', acronym: 'EPS', cash: 215.47, squad_value: 80.5, net_worth: 295.97 },
  { id: 4, name: 'Gama SC', acronym: 'GAM', cash: 181.84, squad_value: 113.56, net_worth: 295.4 },
  { id: 5, name: 'Mangue FC', acronym: 'MNG', cash: 251.7, squad_value: 32.2, net_worth: 283.9 },
  { id: 6, name: 'Tubarões EC', acronym: 'TUB', cash: 300, squad_value: 0, net_worth: 300 },
];

function withContract(
  player: ReturnType<typeof toPlayer>,
  [purchaseValue, loyaltyUntil, remainingDays, penaltyRate]: [
    number,
    string,
    number,
    number,
  ],
): SquadPlayer {
  const contract: PlayerContract = {
    purchase_value: purchaseValue,
    loyalty_until: loyaltyUntil,
    remaining_days: remainingDays,
    penalty_rate: penaltyRate,
  };
  return { ...player, contract };
}

// prettier-ignore
const AGUIAS_SQUAD: SquadPlayer[] = [
  withContract(toPlayer([2, 'Bruno Tavares', 'GOL', 58, 29, 'APTO', 32, 32, [52, 28, 62, 50, 76, 74], 80, 71, 1]), [32, '2028-11-03T11:20:00-03:00', 722, 20]),
  withContract(toPlayer([7, 'Felipe Moura', 'ZAG', 45, 27, 'APTO', 52, 52, [62, 42, 66, 58, 84, 82], 86, 77, 1]), [44.2, '2027-04-04T15:45:00-03:00', 144, 10]),
  withContract(toPlayer([4, 'Diego Ramos', 'LAT', 81, 20, 'MAL_CONDICIONADO', 39.44, 40.43, [84, 58, 70, 72, 68, 66], 88, 72, 1]), [43.38, '2026-12-10T18:00:00-03:00', 29, 5]),
  withContract(toPlayer([24, 'Lucas Ferraz', 'MEI', 60, 28, 'DOENTE', 34.29, 24, [68, 66, 78, 74, 50, 60], 84, 71, 1]), [28.8, '2026-11-07T09:00:00-03:00', 0, 0]),
  withContract(toPlayer([25, 'Sávio Lima', 'MEI', 85, 31, 'MAL_CONDICIONADO', 26.18, 22.25, [66, 60, 72, 70, 48, 58], 76, 66, 1]), [22.25, '2027-05-08T11:00:00-03:00', 177, 10]),
  withContract(toPlayer([11, 'João Silva', 'ATA', 72, 23, 'APTO', 52, 52, [80, 82, 68, 76, 36, 70], 86, 77, 1]), [52, '2029-11-04T17:10:00-03:00', 1089, 20]),
];

export type LineupSlotMock = {
  label: string;
  positions: string;
  playerId: number | null;
};

// simulacao
// Escalação já distribuída nas vagas da 2-1-1 e reservas prontos, só para
// desenhar a tela: a API devolve formation e players, e as vagas e os reservas
// ainda não são montados pela tela
export function findLineupMock(clubId: number): {
  formation: Formation | null;
  slots: LineupSlotMock[];
  bench: SquadPlayer[];
} {
  const isAguias = clubId === 1;
  return {
    formation: isAguias ? '2-1-1' : null,
    slots: [
      { label: 'Goleiro', positions: 'GOL', playerId: isAguias ? 2 : null },
      {
        label: 'Defesa',
        positions: 'ZAG ou LAT',
        playerId: isAguias ? 7 : null,
      },
      {
        label: 'Defesa',
        positions: 'ZAG ou LAT',
        playerId: isAguias ? 4 : null,
      },
      { label: 'Meio', positions: 'MEI', playerId: isAguias ? 25 : null },
      { label: 'Ataque', positions: 'ATA', playerId: isAguias ? 11 : null },
    ],
    bench: isAguias ? [AGUIAS_SQUAD[3]] : [],
  };
}
