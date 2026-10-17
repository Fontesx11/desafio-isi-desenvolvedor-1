import { formatBrasiliaDateTime } from '../../../core/utils/date.utils.js';
import { ContractSummary } from '../../contratos/contracts.service.js';
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

export type SquadPlayer = {
  player: PlayerWithDynamicValues;
  contract: ContractSummary | null;
};

export type ClubDetails = {
  club: ClubWithDynamicValues;
  squad: SquadPlayer[];
};

export class SquadPlayerResponseDto extends PlayerResponseDto {
  contract: {
    purchase_value: number;
    loyalty_until: string;
    remaining_days: number;
    penalty_rate: number;
  } | null;

  constructor({ player, contract }: SquadPlayer) {
    super(player);

    if (contract === null) {
      this.contract = null;
      return;
    }

    this.contract = {
      purchase_value: Number(contract.purchaseValue),
      loyalty_until: formatBrasiliaDateTime(contract.loyaltyUntil),
      remaining_days: contract.remainingDays,
      penalty_rate: contract.penaltyRate,
    };
  }
}

export class ClubResponseDto {
  id: number;
  name: string;
  acronym: string;
  cash: number;
  squad_value: number;
  net_worth: number;
  players?: SquadPlayerResponseDto[];

  constructor(club: ClubWithDynamicValues, squad?: SquadPlayer[]) {
    this.id = club.id;
    this.name = club.name;
    this.acronym = club.acronym;
    this.cash = Number(club.cash);
    this.squad_value = club.squadValue;
    this.net_worth = club.netWorth;

    if (squad) {
      this.players = squad.map((item) => new SquadPlayerResponseDto(item));
    }
  }
}
