import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { CreatePlayerDto } from './dtos/create-player.dto.js';
import {
  PlayerResponseDto,
  toPlayerResponse,
} from './dtos/player-response.dto.js';
import { PlayersService } from './players.service.js';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async create(
    @Body() dto: CreatePlayerDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PlayerResponseDto> {
    const player = await this.playersService.create(dto);
    response.location(`/api/v1/players/${player.id}`);
    return toPlayerResponse(player);
  }

  @Get(':id')
  async findOne(@IdParam() id: number): Promise<PlayerResponseDto> {
    const player = await this.playersService.findOne({ id });
    return toPlayerResponse(player);
  }
}
