import { CreatePlayerDto } from '../../src/modules/jogadores/dtos/create-player.dto.js';
import { Player } from '../../src/modules/jogadores/entities/player.entity.js';
import {
  PlayerCondition,
  PlayerPosition,
} from '../../src/modules/jogadores/enums/players.enum.js';

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

export function buildPlayer(overrides: Partial<Player> = {}): Player {
  return Object.assign(
    new Player(),
    meiaLuaDto,
    {
      id: 2,
      baseValue: '40.00',
      condition: PlayerCondition.APTO,
      clubId: null,
    },
    overrides,
  );
}
