import type { Club } from '../types/clubs.types';

// Dados fixos no formato de GET /clubs (ordem por nome, a padrão da API),
// usados enquanto a tela não chama a API
// prettier-ignore
export const CLUBS_MOCK: Club[] = [
  { id: 1, name: 'Águias FC', acronym: 'AGU', cash: 51.58, squad_value: 222.68, net_worth: 274.26 },
  { id: 2, name: 'Delta FC', acronym: 'DEL', cash: 91.85, squad_value: 200.76, net_worth: 292.61 },
  { id: 3, name: 'Épsilon EC', acronym: 'EPS', cash: 215.47, squad_value: 80.5, net_worth: 295.97 },
  { id: 4, name: 'Gama SC', acronym: 'GAM', cash: 181.84, squad_value: 113.56, net_worth: 295.4 },
  { id: 5, name: 'Mangue FC', acronym: 'MNG', cash: 251.7, squad_value: 32.2, net_worth: 283.9 },
  { id: 6, name: 'Tubarões EC', acronym: 'TUB', cash: 300, squad_value: 0, net_worth: 300 },
];

// Resposta de POST /clubs: o clube começa com 300,00 e sem jogadores
export const CREATED_CLUB_MOCK: Club = {
  id: 7,
  name: 'Leões da Serra',
  acronym: 'LDS',
  cash: 300,
  squad_value: 0,
  net_worth: 300,
};
