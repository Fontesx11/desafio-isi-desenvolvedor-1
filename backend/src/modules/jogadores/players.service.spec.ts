import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Mock } from 'vitest';
import { buildPlayer, meiaLuaDto } from '../../../test/mocks/players.mock.js';
import { ClubsService } from '../clubes/clubs.service.js';
import { ListPlayersQueryDto } from './dtos/list-players-query.dto.js';
import { UpdatePlayerDto } from './dtos/update-player.dto.js';
import { Player } from './entities/player.entity.js';
import { PlayerCondition, PlayerPosition } from './enums/players.enum.js';
import { PlayersService } from './players.service.js';

const { APTO, MAL_CONDICIONADO, DOENTE } = PlayerCondition;

describe('PlayersService', () => {
  let service: PlayersService;
  let playersRepository: {
    create: Mock;
    merge: Mock;
    save: Mock;
    softRemove: Mock;
    findOneBy: Mock;
    find: Mock;
  };
  let clubsService: { findOne: Mock };

  beforeEach(async () => {
    playersRepository = {
      create: vi.fn((data: Partial<Player>) =>
        Object.assign(new Player(), data),
      ),
      merge: vi.fn((player: Player, data: Partial<Player>) =>
        Object.assign(player, data),
      ),
      save: vi.fn(),
      softRemove: vi.fn(),
      findOneBy: vi.fn(),
      find: vi.fn(),
    };
    clubsService = { findOne: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: getRepositoryToken(Player), useValue: playersRepository },
        { provide: ClubsService, useValue: clubsService },
      ],
    }).compile();

    service = module.get(PlayersService);
  });

  describe('create', () => {
    it('registers Meia Lua with base value 40.00, overall 75 and market value 40.00 (README 2.1.3)', async () => {
      const player = await service.create(meiaLuaDto);

      expect(player.baseValue).toBe('40.00');
      expect(player.overall).toBe(75);
      expect(player.marketValue).toBe(40);
      expect(player.condition).toBe(APTO);
      expect(player.clubId).toBeNull();
      expect(playersRepository.save).toHaveBeenCalledOnce();
    });
  });

  describe('changePlayerCondition', () => {
    it('lowers the market value to 37.00 when Meia Lua becomes MAL_CONDICIONADO (README 2.1.4)', async () => {
      playersRepository.findOneBy.mockResolvedValue(buildPlayer());

      const player = await service.changePlayerCondition(2, MAL_CONDICIONADO);

      expect(player.condition).toBe(MAL_CONDICIONADO);
      expect(player.marketValue).toBe(37);
      expect(playersRepository.save).toHaveBeenCalledOnce();
    });

    it('rejects DOENTE directly to APTO with 409, without saving', async () => {
      playersRepository.findOneBy.mockResolvedValue(
        buildPlayer({ condition: DOENTE }),
      );

      await expect(service.changePlayerCondition(2, APTO)).rejects.toThrow(
        ConflictException,
      );
      expect(playersRepository.save).not.toHaveBeenCalled();
    });

    it('accepts the current condition without saving', async () => {
      playersRepository.findOneBy.mockResolvedValue(buildPlayer());

      const player = await service.changePlayerCondition(2, APTO);

      expect(player.condition).toBe(APTO);
      expect(playersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    function buildEdit(
      changes: Partial<UpdatePlayerDto> = {},
    ): UpdatePlayerDto {
      return Object.assign(
        {
          name: 'Meia Lua Souza',
          position: PlayerPosition.ATA,
          agility: 70,
          age: 26,
        },
        changes,
      );
    }

    it('changes name, position, agility and age, recalculating the overall and keeping the base value (RN08)', async () => {
      playersRepository.findOneBy.mockResolvedValue(buildPlayer());

      const player = await service.update(2, buildEdit());

      expect(player.name).toBe('Meia Lua Souza');
      expect(player.position).toBe(PlayerPosition.ATA);
      expect(player.overall).toBe(72);
      expect(player.baseValue).toBe('40.00');
      expect(playersRepository.save).toHaveBeenCalledOnce();
    });

    it('rejects a position change for a player with a club with 409, without saving', async () => {
      playersRepository.findOneBy.mockResolvedValue(buildPlayer({ clubId: 1 }));

      await expect(service.update(2, buildEdit())).rejects.toThrow(
        ConflictException,
      );
      expect(playersRepository.save).not.toHaveBeenCalled();
    });

    it('accepts the same position for a player with a club', async () => {
      playersRepository.findOneBy.mockResolvedValue(buildPlayer({ clubId: 1 }));

      const player = await service.update(
        2,
        buildEdit({ position: PlayerPosition.MEI }),
      );

      expect(player.position).toBe(PlayerPosition.MEI);
    });

    it('rejects an age lower than the current one with 409, without saving', async () => {
      playersRepository.findOneBy.mockResolvedValue(buildPlayer());

      await expect(service.update(2, buildEdit({ age: 24 }))).rejects.toThrow(
        ConflictException,
      );
      expect(playersRepository.save).not.toHaveBeenCalled();
    });

    it('accepts the same age', async () => {
      playersRepository.findOneBy.mockResolvedValue(buildPlayer());

      const player = await service.update(2, buildEdit({ age: 25 }));

      expect(player.age).toBe(25);
    });
  });

  describe('remove', () => {
    it('deletes a free player logically (RN09)', async () => {
      const player = buildPlayer();
      playersRepository.findOneBy.mockResolvedValue(player);

      await service.remove(2);

      expect(playersRepository.softRemove).toHaveBeenCalledWith(player);
    });

    it('rejects a player with a club with 409, without deleting', async () => {
      playersRepository.findOneBy.mockResolvedValue(buildPlayer({ clubId: 1 }));

      await expect(service.remove(2)).rejects.toThrow(ConflictException);
      expect(playersRepository.softRemove).not.toHaveBeenCalled();
    });

    it('responds 404 for a player that does not exist or was already deleted', async () => {
      playersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(9)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('responds 404 for a club_id that does not exist, before listing', async () => {
      clubsService.findOne.mockRejectedValue(new NotFoundException());
      const query = Object.assign(new ListPlayersQueryDto(), { club_id: 999 });

      await expect(service.findAll(query)).rejects.toThrow(NotFoundException);
      expect(playersRepository.find).not.toHaveBeenCalled();
    });
  });
});
