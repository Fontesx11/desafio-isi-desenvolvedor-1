import { toPlayer } from '@/modules/jogadores/mocks/players.mock';
import type {
  Club,
  ClubDetails,
  Formation,
  PlayerContract,
  SaleResult,
  SquadPlayer,
  Transaction,
  TransactionsSummary,
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

export const CREATED_CLUB_MOCK: ClubDetails = {
  id: 7,
  name: 'Leões da Serra',
  acronym: 'LDS',
  cash: 300,
  squad_value: 0,
  net_worth: 300,
  players: [],
};

// simulacao
// Sem a API, só a Águias FC tem elenco; os outros clubes aparecem vazios, e um
// id que não existe abre a Águias FC
export function findClubDetails(clubId: number): ClubDetails {
  if (clubId === CREATED_CLUB_MOCK.id) {
    return CREATED_CLUB_MOCK;
  }
  const club = CLUBS_MOCK.find((item) => item.id === clubId) ?? CLUBS_MOCK[0];
  return { ...club, players: club.id === 1 ? AGUIAS_SQUAD : [] };
}

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

export const SALE_RESULT_MOCK: SaleResult = {
  id: 12,
  club_id: 1,
  player_id: 7,
  player_name: 'Felipe Moura',
  type: 'VENDA',
  value: 52,
  fee: 0.78,
  penalty: 5.2,
  profit: 7.8,
  cash_change: 46.02,
  created_at: '2026-11-12T15:00:00-03:00',
  purchase_value: 44.2,
  remaining_days: 144,
  penalty_rate: 10,
  contract_status: 'RESCINDIDO',
  club_cash: 97.6,
};

type TransactionRow = [
  id: number,
  createdAt: string,
  type: Transaction['type'],
  playerId: number,
  playerName: string,
  value: number,
  fee: number,
  penalty: number,
  profit: number | null,
  cashChange: number,
];

// prettier-ignore
const AGUIAS_TRANSACTIONS: TransactionRow[] = [
  [10, '2026-11-08T11:00:00-03:00', 'COMPRA', 25, 'Sávio Lima', 22.25, 0, 0, null, -22.25],
  [9, '2026-11-07T10:30:00-03:00', 'COMPRA', 4, 'Diego Ramos', 43.38, 2.17, 0, null, -45.55],
  [8, '2026-11-06T09:00:00-03:00', 'COMPRA', 24, 'Lucas Ferraz', 28.8, 0, 0, null, -28.8],
  [7, '2026-11-06T08:30:00-03:00', 'VENDA', 18, 'Renan Castro', 32.3, 0, 6.46, -5.7, 25.84],
  [6, '2026-11-05T17:10:00-03:00', 'COMPRA', 11, 'João Silva', 52, 2.6, 0, null, -54.6],
  [5, '2026-11-05T16:40:00-03:00', 'VENDA', 26, 'Meia Lua', 40, 0.3, 4, 3, 35.7],
  [4, '2026-11-04T15:45:00-03:00', 'COMPRA', 7, 'Felipe Moura', 44.2, 2.21, 0, null, -46.41],
  [3, '2026-11-03T11:20:00-03:00', 'COMPRA', 2, 'Bruno Tavares', 32, 1.6, 0, null, -33.6],
  [2, '2026-11-02T14:00:00-03:00', 'COMPRA', 18, 'Renan Castro', 38, 1.9, 0, null, -39.9],
  [1, '2026-11-02T10:15:00-03:00', 'COMPRA', 26, 'Meia Lua', 37, 1.85, 0, null, -38.85],
];

const EMPTY_SUMMARY: TransactionsSummary = {
  total_spent: 0,
  total_received: 0,
  total_fees: 0,
  total_penalties: 0,
  total_profit: 0,
};

// simulacao
// Só a Águias FC tem histórico; os filtros ainda não mudam a resposta
export function findTransactionsMock(clubId: number): {
  data: Transaction[];
  summary: TransactionsSummary;
} {
  if (clubId !== 1) {
    return { data: [], summary: EMPTY_SUMMARY };
  }
  return {
    data: AGUIAS_TRANSACTIONS.map(
      ([
        id,
        createdAt,
        type,
        playerId,
        playerName,
        value,
        fee,
        penalty,
        profit,
        cashChange,
      ]) => ({
        id,
        club_id: 1,
        player_id: playerId,
        player_name: playerName,
        type,
        value,
        fee,
        penalty,
        profit,
        cash_change: cashChange,
        created_at: createdAt,
      }),
    ),
    summary: {
      total_spent: 309.96,
      total_received: 61.54,
      total_fees: 12.63,
      total_penalties: 10.46,
      total_profit: -2.7,
    },
  };
}

// simulacao
// Opções fixas do filtro "Jogador"; a tela ainda não monta a lista pelo histórico
export const TRANSACTION_PLAYERS_MOCK = [
  { id: 2, name: 'Bruno Tavares' },
  { id: 4, name: 'Diego Ramos' },
  { id: 7, name: 'Felipe Moura' },
  { id: 11, name: 'João Silva' },
  { id: 24, name: 'Lucas Ferraz' },
  { id: 26, name: 'Meia Lua' },
  { id: 18, name: 'Renan Castro' },
  { id: 25, name: 'Sávio Lima' },
];
