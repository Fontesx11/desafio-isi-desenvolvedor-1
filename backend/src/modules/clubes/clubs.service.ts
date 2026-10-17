import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { ContractsService } from '../contratos/contracts.service.js';
import { PlayerSort } from '../jogadores/enums/players.enum.js';
import { calculatePlayerDynamicValues } from '../jogadores/utils/players.calculations.js';
import { sortPlayers } from '../jogadores/utils/players.sorting.js';
import {
  ClubDetails,
  ClubWithDynamicValues,
} from './dtos/club-response.dto.js';
import { CreateClubDto } from './dtos/create-club.dto.js';
import { ListClubsQueryDto } from './dtos/list-clubs-query.dto.js';
import { Club } from './entities/club.entity.js';
import { sortClubs } from './utils/clubs.sorting.js';

const CLUB_LIMIT = 20;
const INITIAL_CASH = '300.00';
const SQUAD_LIMIT = 12;

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private readonly clubsRepository: Repository<Club>,
    private readonly contractsService: ContractsService,
  ) {}

  async findOne(
    condition: FindOptionsWhere<Club>,
    relations?: FindOptionsRelations<Club>,
  ): Promise<Club> {
    const club = await this.clubsRepository.findOne({
      where: condition,
      relations,
    });

    if (!club) {
      throw new NotFoundException('Club not found');
    }

    return club;
  }

  async findById(id: number): Promise<ClubDetails> {
    const club = await this.findOne({ id }, { players: true });
    const contracts = await this.contractsService.findActiveByClub(id);
    const clubWithValues = this.calculateDynamicValues(club);
    const now = new Date();

    const squad = clubWithValues.squad.map((player) => {
      const contract = contracts.find((item) => item.playerId === player.id);

      if (!contract) {
        return { player, contract: null };
      }

      return {
        player,
        contract: this.contractsService.calculateContractSummary(contract, now),
      };
    });

    return { club: clubWithValues, squad };
  }

  assertCanBuy(club: Club, totalCostCents: number): void {
    const cashLimitCents = Math.round(Number(club.cash) * 100) / 2;

    if (totalCostCents > cashLimitCents) {
      throw new ConflictException(
        'the total cost cannot exceed 50% of the club cash',
      );
    }

    if (club.players.length >= SQUAD_LIMIT) {
      throw new ConflictException(
        `a club can have at most ${SQUAD_LIMIT} players`,
      );
    }
  }

  async changeCash(
    manager: EntityManager,
    club: Club,
    changeCents: number,
  ): Promise<string> {
    const cashCents = Math.round(Number(club.cash) * 100) + changeCents;
    const cash = (cashCents / 100).toFixed(2);

    await manager.update(Club, { id: club.id }, { cash });

    return cash;
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
    });

    await this.clubsRepository.save(club);

    return { ...club, squad: [], squadValue: 0, netWorth: Number(club.cash) };
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
    const squad = sortPlayers(
      club.players.map((player) => calculatePlayerDynamicValues(player)),
      [PlayerSort.POSITION],
    );

    let squadValueCents = 0;
    for (const player of squad) {
      squadValueCents += Math.round(player.marketValue * 100);
    }

    const cashCents = Math.round(Number(club.cash) * 100);

    return {
      ...club,
      squad,
      squadValue: squadValueCents / 100,
      netWorth: (cashCents + squadValueCents) / 100,
    };
  }
}
