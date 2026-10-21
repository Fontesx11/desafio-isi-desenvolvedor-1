import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  caioRochaMock,
  daviMeloMock,
  daviMeloUpdateDto,
  meiaLuaDto,
  meiaLuaMalCondicionadoMock,
  meiaLuaMock,
  searchLuaQueryMock,
} from '../../../test/mocks/players.mock.js';
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
            transaction: (work: (entityManager: typeof manager) => unknown) => work(manager),
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

    expect(playersRepository.create).toHaveBeenCalledWith(expect.objectContaining({ baseValue: '40.00' }));
    expect(player.overall).toBe(75);
    expect(player.marketValue).toBe(40);
  });

  it('lowers the market value to 37.00 when Meia Lua becomes MAL_CONDICIONADO', async () => {
    vi.spyOn(playersRepository, 'findOneBy').mockResolvedValue({
      ...meiaLuaMock,
    });

    const player = await service.changePlayerCondition(2, PlayerCondition.MAL_CONDICIONADO);

    expect(player.marketValue).toBe(37);
    expect(manager.save).toHaveBeenCalledOnce();
  });

  it('updates Davi Melo with agility 70 and age 23', async () => {
    vi.spyOn(playersRepository, 'findOneBy').mockResolvedValue({ ...daviMeloMock });
    vi.spyOn(playersRepository, 'merge').mockImplementation((player) => Object.assign(player, daviMeloUpdateDto));
    vi.spyOn(playersRepository, 'save').mockResolvedValue(daviMeloMock);

    const player = await service.update(4, daviMeloUpdateDto);

    expect(playersRepository.save).toHaveBeenCalledOnce();
    expect(player).toEqual(expect.objectContaining(daviMeloUpdateDto));
  });

  it('soft deletes the free player 9', async () => {
    vi.spyOn(playersRepository, 'findOneBy').mockResolvedValue(caioRochaMock);
    vi.spyOn(playersRepository, 'softRemove').mockResolvedValue(caioRochaMock);

    await service.remove(9);

    expect(playersRepository.softRemove).toHaveBeenCalledWith(caioRochaMock);
  });

  it('lists only Meia Lua with market value 37.00 when searching for lua among MEI players', async () => {
    vi.spyOn(playersRepository, 'find').mockResolvedValue([meiaLuaMalCondicionadoMock]);

    const page = await service.findAll(searchLuaQueryMock);

    expect(page.data).toEqual([expect.objectContaining({ id: 2, marketValue: 37 })]);
    expect(page.meta).toEqual({ page: 1, limit: 10, total_items: 1, total_pages: 1 });
  });

  it('returns Meia Lua with market value 37.00 and overall 75', async () => {
    vi.spyOn(playersRepository, 'findOneBy').mockResolvedValue(meiaLuaMalCondicionadoMock);

    const player = await service.findById(2);

    expect(player.marketValue).toBe(37);
    expect(player.overall).toBe(75);
  });
});
