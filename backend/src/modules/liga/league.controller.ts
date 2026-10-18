import { Body, Controller, Get, Post, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { PlayerResponseDto } from '../jogadores/dtos/player-response.dto.js';
import { MatchResponseDto } from '../partidas/dtos/match-response.dto.js';
import { CreateMatchDto } from './dtos/create-match.dto.js';
import { UpdateLineupDto } from './dtos/update-lineup.dto.js';
import { ClubLineupResponse } from './interfaces/lineup.interface.js';
import { LeagueService } from './league.service.js';

@Controller()
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Put('clubs/:id/lineup')
  async updateLineup(
    @IdParam() id: number,
    @Body() dto: UpdateLineupDto,
  ): Promise<ClubLineupResponse> {
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

  @Post('matches')
  async playMatch(
    @Body() dto: CreateMatchDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<MatchResponseDto> {
    const details = await this.leagueService.playMatch(dto);
    response.location(`/api/v1/matches/${details.match.id}`);
    return new MatchResponseDto(details);
  }
}
