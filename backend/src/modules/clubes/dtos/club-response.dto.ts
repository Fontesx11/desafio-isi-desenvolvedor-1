import { Club } from '../entities/club.entity.js';

export type ClubWithDynamicValues = Club & {
  squadValue: number;
  netWorth: number;
};

export class ClubResponseDto {
  id: number;
  name: string;
  acronym: string;
  cash: number;
  squad_value: number;
  net_worth: number;

  constructor(club: ClubWithDynamicValues) {
    this.id = club.id;
    this.name = club.name;
    this.acronym = club.acronym;
    this.cash = Number(club.cash);
    this.squad_value = club.squadValue;
    this.net_worth = club.netWorth;
  }
}
