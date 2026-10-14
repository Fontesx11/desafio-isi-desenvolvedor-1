import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller.js';
import { PlayersService } from './players.service.js';

describe('PlayersController', () => {
  let controller: PlayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [{ provide: PlayersService, useValue: {} }],
    }).compile();

    controller = module.get(PlayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
