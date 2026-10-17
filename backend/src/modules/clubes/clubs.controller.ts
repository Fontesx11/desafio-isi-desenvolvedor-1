import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { ClubsService } from './clubs.service.js';
import { ClubResponseDto } from './dtos/club-response.dto.js';
import { CreateClubDto } from './dtos/create-club.dto.js';
import { ListClubsQueryDto } from './dtos/list-clubs-query.dto.js';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  async create(
    @Body() dto: CreateClubDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ClubResponseDto> {
    const club = await this.clubsService.create(dto);
    response.location(`/api/v1/clubs/${club.id}`);
    return new ClubResponseDto(club);
  }

  @Get()
  async findAll(@Query() query: ListClubsQueryDto): Promise<ClubResponseDto[]> {
    const clubs = await this.clubsService.findAll(query);
    return clubs.map((club) => new ClubResponseDto(club));
  }

  @Get(':id')
  async findOne(@IdParam() id: number): Promise<ClubResponseDto> {
    const { club, squad } = await this.clubsService.findById(id);
    return new ClubResponseDto(club, squad);
  }
}
