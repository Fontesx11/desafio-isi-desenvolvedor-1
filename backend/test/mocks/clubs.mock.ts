import { Club } from '../../src/modules/clubes/entities/club.entity.js';
import { meiaLuaAfterPurchaseMock } from './players.mock.js';

export const aguiasMock: Club = {
  id: 1,
  name: 'Águias FC',
  acronym: 'AGU',
  cash: '300.00',
  formation: null,
  createdAt: new Date('2026-11-01T09:00:00-03:00'),
  players: [],
};

export const aguiasAfterPurchaseMock: Club = {
  ...aguiasMock,
  cash: '261.15',
  players: [meiaLuaAfterPurchaseMock],
};
