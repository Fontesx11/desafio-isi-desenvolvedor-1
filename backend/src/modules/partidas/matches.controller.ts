import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { CreateMatchDto } from './dtos/create-match.dto.js';
import { ListMatchesQueryDto } from './dtos/list-matches-query.dto.js';
import { MatchResponseDto } from './dtos/match-response.dto.js';
import { MatchesService } from './matches.service.js';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async playMatch(@Body() dto: CreateMatchDto, @Res({ passthrough: true }) response: Response): Promise<MatchResponseDto> {
    const { match, result, duels } = await this.matchesService.playMatch(dto);
    response.location(`/api/v1/matches/${match.id}`);
    return new MatchResponseDto(match, result, duels);
  }

  @Get()
  async findAll(@Query() query: ListMatchesQueryDto): Promise<MatchResponseDto[]> {
    const matches = await this.matchesService.findAll(query);
    return matches.map(({ match, result }) => new MatchResponseDto(match, result));
  }

  @Get(':id')
  async findOne(@IdParam() id: number): Promise<MatchResponseDto> {
    const { match, result, duels } = await this.matchesService.findById(id);
    return new MatchResponseDto(match, result, duels);
  }
}
