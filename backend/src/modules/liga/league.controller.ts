import { Body, Controller, Get, Put } from '@nestjs/common';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { PlayerResponseDto } from '../jogadores/dtos/player-response.dto.js';
import { UpdateLineupDto } from './dtos/update-lineup.dto.js';
import { ClubLineupResponse } from './interfaces/lineup.interface.js';
import { LeagueService } from './league.service.js';

@Controller()
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Put('clubs/:id/lineup')
  async updateLineup(@IdParam() id: number, @Body() dto: UpdateLineupDto): Promise<ClubLineupResponse> {
    const lineup = await this.leagueService.updateLineup(id, dto);
    return {
      club_id: lineup.clubId,
      formation: lineup.formation,
      complete: lineup.complete,
      players: lineup.players.map((player) => new PlayerResponseDto(player)),
    };
  }

  @Get('clubs/:id/lineup')
  async findLineup(@IdParam() id: number): Promise<ClubLineupResponse> {
    const lineup = await this.leagueService.findLineup(id);
    return {
      club_id: lineup.clubId,
      formation: lineup.formation,
      complete: lineup.complete,
      players: lineup.players.map((player) => new PlayerResponseDto(player)),
    };
  }
}
