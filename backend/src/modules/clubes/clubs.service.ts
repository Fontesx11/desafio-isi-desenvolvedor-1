import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PlayersService } from '../jogadores/players.service.js';
import { ClubWithDynamicValues } from './dtos/club-response.dto.js';
import { CreateClubDto } from './dtos/create-club.dto.js';
import { ListClubsQueryDto } from './dtos/list-clubs-query.dto.js';
import { Club } from './entities/club.entity.js';
import { sortClubs } from './utils/clubs.sorting.js';

const CLUB_LIMIT = 20;
const INITIAL_CASH = '300.00';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private readonly clubsRepository: Repository<Club>,
    private readonly playersService: PlayersService,
  ) {}

  async findOne(condition: FindOptionsWhere<Club>): Promise<Club> {
    const club = await this.clubsRepository.findOneBy(condition);

    if (!club) {
      throw new NotFoundException('Club not found');
    }

    return club;
  }

  async create(dto: CreateClubDto): Promise<ClubWithDynamicValues> {
    const clubsCount = await this.clubsRepository.count();

    if (clubsCount >= CLUB_LIMIT) {
      throw new ConflictException(
        `the league accepts at most ${CLUB_LIMIT} clubs`,
      );
    }

    const nameTaken = await this.clubsRepository
      .createQueryBuilder('club')
      .where('LOWER(club.name) = LOWER(:name)', {
        name: dto.name,
      })
      .getExists();

    if (nameTaken) {
      throw new ConflictException('a club with this name already exists');
    }

    const acronymTaken = await this.clubsRepository.existsBy({
      acronym: dto.acronym,
    });

    if (acronymTaken) {
      throw new ConflictException('a club with this acronym already exists');
    }

    const club = this.clubsRepository.create({
      name: dto.name,
      acronym: dto.acronym,
      cash: INITIAL_CASH,
      players: [],
    });

    await this.clubsRepository.save(club);

    return this.calculateDynamicValues(club);
  }

  async findAll(query: ListClubsQueryDto): Promise<ClubWithDynamicValues[]> {
    const clubs = await this.clubsRepository.find({
      relations: { players: true },
    });
    const clubsWithValues = clubs.map((club) =>
      this.calculateDynamicValues(club),
    );

    return sortClubs(clubsWithValues, query.sort);
  }

  calculateDynamicValues(club: Club): ClubWithDynamicValues {
    let squadValueCents = 0;
    for (const player of club.players) {
      const { marketValue } =
        this.playersService.calculateDynamicValues(player);
      squadValueCents += Math.round(marketValue * 100);
    }

    const cashCents = Math.round(Number(club.cash) * 100);

    return {
      ...club,
      squadValue: squadValueCents / 100,
      netWorth: (cashCents + squadValueCents) / 100,
    };
  }
}
