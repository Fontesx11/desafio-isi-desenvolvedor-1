import {
  PlayerResponseDto,
  PlayerWithDynamicValues,
} from '../../jogadores/dtos/player-response.dto.js';
import { Club } from '../entities/club.entity.js';

export type ClubWithDynamicValues = Club & {
  squad: PlayerWithDynamicValues[];
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
  players?: PlayerResponseDto[];

  constructor(
    club: ClubWithDynamicValues,
    players?: PlayerWithDynamicValues[],
  ) {
    this.id = club.id;
    this.name = club.name;
    this.acronym = club.acronym;
    this.cash = Number(club.cash);
    this.squad_value = club.squadValue;
    this.net_worth = club.netWorth;

    if (players) {
      this.players = players.map((player) => new PlayerResponseDto(player));
    }
  }
}
