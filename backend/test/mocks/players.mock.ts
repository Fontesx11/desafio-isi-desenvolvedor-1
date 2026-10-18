import { CreatePlayerDto } from '../../src/modules/jogadores/dtos/create-player.dto.js';
import { Player } from '../../src/modules/jogadores/entities/player.entity.js';
import {
  PlayerCondition,
  PlayerPosition,
} from '../../src/modules/jogadores/enums/players.enum.js';
import { PlayerWithDynamicValues } from '../../src/modules/jogadores/interfaces/player.interface.js';

export const meiaLuaDto: CreatePlayerDto = {
  name: 'Meia Lua',
  position: PlayerPosition.MEI,
  agility: 85,
  age: 25,
  pace: 70,
  shooting: 68,
  passing: 82,
  dribbling: 79,
  defending: 55,
  physical: 64,
  potential: 86,
};

export const meiaLuaMock: Player = {
  id: 2,
  name: 'Meia Lua',
  position: PlayerPosition.MEI,
  agility: 85,
  age: 25,
  baseValue: '40.00',
  condition: PlayerCondition.APTO,
  clubId: null,
  pace: 70,
  shooting: 68,
  passing: 82,
  dribbling: 79,
  defending: 55,
  physical: 64,
  potential: 86,
  deletedAt: null,
  createdAt: new Date('2026-11-01T09:00:00-03:00'),
  updatedAt: new Date('2026-11-01T09:00:00-03:00'),
};

export const meiaLuaBeforePurchaseMock: PlayerWithDynamicValues = {
  ...meiaLuaMock,
  condition: PlayerCondition.MAL_CONDICIONADO,
  overall: 75,
  marketValue: 37,
};

export const meiaLuaAfterPurchaseMock: Player = {
  ...meiaLuaMock,
  condition: PlayerCondition.MAL_CONDICIONADO,
  clubId: 1,
};

export const meiaLuaBeforeSaleMock: PlayerWithDynamicValues = {
  ...meiaLuaMock,
  clubId: 1,
  overall: 75,
  marketValue: 40,
};
