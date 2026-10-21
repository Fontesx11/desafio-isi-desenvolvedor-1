import { CreateClubDto } from '../../src/modules/clubes/dtos/create-club.dto.js';
import { ListClubsQueryDto } from '../../src/modules/clubes/dtos/list-clubs-query.dto.js';
import { Club } from '../../src/modules/clubes/entities/club.entity.js';
import { ClubSort } from '../../src/modules/clubes/enums/clubs.enum.js';
import { meiaLuaAfterPurchaseMock } from './players.mock.js';

export const aguiasDto: CreateClubDto = {
  name: 'Águias FC',
  acronym: 'AGU',
};

export const listClubsQueryMock: ListClubsQueryDto = {
  sort: ClubSort.NAME,
};

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
