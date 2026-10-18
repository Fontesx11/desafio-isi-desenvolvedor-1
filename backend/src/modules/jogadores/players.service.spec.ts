import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { meiaLuaDto, meiaLuaMock } from '../../../test/mocks/players.mock.js';
import { ClubsService } from '../clubes/clubs.service.js';
import { LineupsService } from '../escalacoes/lineups.service.js';
import { Player } from './entities/player.entity.js';
import { PlayerCondition } from './enums/players.enum.js';
import { PlayersService } from './players.service.js';

describe('PlayersService', () => {
  let service: PlayersService;
  let playersRepository: Repository<Player>;
  const manager = { save: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: getRepositoryToken(Player), useClass: Repository },
        {
          provide: DataSource,
          useValue: {
            transaction: (work: (entityManager: typeof manager) => unknown) =>
              work(manager),
          },
        },
        { provide: ClubsService, useValue: {} },
        { provide: LineupsService, useValue: {} },
      ],
    }).compile();

    service = module.get(PlayersService);
    playersRepository = module.get(getRepositoryToken(Player));
  });

  it('registers Meia Lua with base value 40.00, overall 75 and market value 40.00', async () => {
    vi.spyOn(playersRepository, 'create').mockReturnValue({ ...meiaLuaMock });
    vi.spyOn(playersRepository, 'save').mockResolvedValue(meiaLuaMock);

    const player = await service.create(meiaLuaDto);

    expect(playersRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ baseValue: '40.00' }),
    );
    expect(player.overall).toBe(75);
    expect(player.marketValue).toBe(40);
  });

  it('lowers the market value to 37.00 when Meia Lua becomes MAL_CONDICIONADO', async () => {
    vi.spyOn(playersRepository, 'findOneBy').mockResolvedValue({
      ...meiaLuaMock,
    });

    const player = await service.changePlayerCondition(
      2,
      PlayerCondition.MAL_CONDICIONADO,
    );

    expect(player.marketValue).toBe(37);
    expect(manager.save).toHaveBeenCalledOnce();
  });
});
