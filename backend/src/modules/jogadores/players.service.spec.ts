import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity.js';
import { PlayersService } from './players.service.js';

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: getRepositoryToken(Player), useValue: {} },
      ],
    }).compile();

    service = module.get(PlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
