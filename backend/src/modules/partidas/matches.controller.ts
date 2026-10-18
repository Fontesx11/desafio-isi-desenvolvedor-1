import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { CreateMatchDto } from './dtos/create-match.dto.js';
import { MatchResponseDto } from './dtos/match-response.dto.js';
import { MatchesService } from './matches.service.js';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async playMatch(
    @Body() dto: CreateMatchDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<MatchResponseDto> {
    const details = await this.matchesService.playMatch(dto);
    response.location(`/api/v1/matches/${details.match.id}`);
    return new MatchResponseDto(details);
  }

  @Get(':id')
  async findOne(@IdParam() id: number): Promise<MatchResponseDto> {
    const details = await this.matchesService.findById(id);
    return new MatchResponseDto(details);
  }
}
