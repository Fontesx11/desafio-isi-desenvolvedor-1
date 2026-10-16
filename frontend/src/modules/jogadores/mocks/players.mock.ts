import type { Player } from '../types/players.types';

type MockRow = [
  id: number,
  name: string,
  position: Player['position'],
  agility: number,
  age: number,
  condition: Player['condition'],
  baseValue: number,
  marketValue: number,
  attributes: [number, number, number, number, number, number],
  potential: number,
  overall: number,
  clubId: number | null,
];

function toPlayer([
  id,
  name,
  position,
  agility,
  age,
  condition,
  baseValue,
  marketValue,
  [pace, shooting, passing, dribbling, defending, physical],
  potential,
  overall,
  clubId,
]: MockRow): Player {
  return {
    id,
    name,
    position,
    agility,
    age,
    condition,
    base_value: baseValue,
    market_value: marketValue,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physical,
    potential,
    overall,
    club_id: clubId,
  };
}

// Uma linha por jogador: fica mais fácil de ler como tabela
// prettier-ignore
const ROWS: MockRow[] = [
  [1, 'André Lacerda', 'GOL', 70, 31, 'APTO', 26, 26, [55, 30, 58, 52, 72, 70], 78, 68, 2],
  [2, 'Bruno Tavares', 'GOL', 58, 29, 'APTO', 32, 32, [52, 28, 62, 50, 76, 74], 80, 71, 1],
  [3, 'Danilo Freitas', 'ZAG', 25, 30, 'MAL_CONDICIONADO', 36, 27, [60, 40, 62, 55, 80, 78], 82, 73, 2],
  [4, 'Diego Ramos', 'LAT', 81, 20, 'MAL_CONDICIONADO', 39.44, 40.43, [84, 58, 70, 72, 68, 66], 88, 72, 1],
  [5, 'Eduardo Paiva', 'MEI', 68, 26, 'APTO', 46, 46, [70, 72, 84, 80, 52, 63], 86, 76, null],
  [6, 'Ênio Carvalho', 'LAT', 83, 18, 'DOENTE', 33.88, 32.19, [82, 55, 66, 70, 64, 60], 90, 69, null],
  [7, 'Felipe Moura', 'ZAG', 45, 27, 'APTO', 52, 52, [62, 42, 66, 58, 84, 82], 86, 77, 1],
  [8, 'Gabriel Antunes', 'ATA', 77, 24, 'APTO', 64, 64, [82, 86, 70, 80, 38, 72], 90, 79, 2],
  [9, 'Heitor Gomes', 'MEI', 92, 22, 'MAL_CONDICIONADO', 52, 48.1, [78, 70, 82, 84, 50, 60], 88, 77, 3],
  [10, 'Ícaro Mendes', 'ATA', 12, 40, 'DOENTE', 24, 14.4, [52, 76, 64, 66, 30, 62], 76, 67, null],
  [11, 'João Silva', 'ATA', 72, 23, 'APTO', 52, 52, [80, 82, 68, 76, 36, 70], 86, 77, 1],
  [12, 'Lucas Prado', 'GOL', 60, 33, 'APTO', 30, 30, [50, 26, 60, 48, 74, 72], 76, 70, 4],
  [13, 'Marcos Vieira', 'ZAG', 50, 28, 'APTO', 40, 40, [64, 38, 60, 54, 80, 78], 84, 74, 5],
  [14, 'Nicolas Duarte', 'LAT', 76, 25, 'APTO', 38, 38, [80, 52, 68, 70, 66, 64], 84, 71, 6],
  [15, 'Otávio Resende', 'MEI', 64, 21, 'APTO', 34, 34, [70, 60, 74, 72, 50, 58], 84, 69, null],
  [16, 'Paulo Souza', 'MEI', 70, 30, 'APTO', 44, 44, [66, 68, 80, 76, 54, 64], 82, 74, 4],
  [17, 'Rafael Nogueira', 'ZAG', 40, 32, 'MAL_CONDICIONADO', 30, 25.5, [58, 36, 58, 50, 78, 80], 80, 71, null],
  [18, 'Renan Castro', 'ATA', 85, 19, 'APTO', 40, 40, [86, 74, 62, 74, 32, 60], 92, 70, null],
  [19, 'Ricardo Alves', 'GOL', 55, 35, 'APTO', 28, 28, [46, 24, 58, 46, 76, 70], 76, 70, 5],
  [20, 'Samuel Costa', 'LAT', 74, 27, 'APTO', 36, 36, [78, 50, 66, 68, 68, 66], 82, 70, 3],
  [21, 'Tiago Moreno', 'ATA', 70, 34, 'APTO', 30, 30, [72, 78, 64, 70, 34, 68], 80, 70, null],
  [22, 'Vitor Lima', 'MEI', 66, 24, 'APTO', 42, 42, [70, 64, 78, 74, 56, 62], 86, 73, 6],
  [23, 'Wagner Rocha', 'ZAG', 48, 29, 'APTO', 38, 38, [60, 40, 58, 52, 82, 80], 84, 74, 3],
];

// Dados fixos no formato de GET /players, usados enquanto a tela não chama a API
export const PLAYERS_MOCK: Player[] = ROWS.map(toPlayer);

// Valores que a API devolveria depois do cadastro (base, mercado e overall)
// prettier-ignore
export const CREATED_PLAYER_MOCK = toPlayer([
  24, 'Davi Melo', 'MEI', 70, 23, 'APTO', 26, 26, [66, 62, 74, 70, 48, 58], 82, 68, null,
]);
