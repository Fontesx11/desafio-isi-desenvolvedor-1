import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ClubsService } from './clubs.service.js';
import { ClubResponseDto } from './dtos/club-response.dto.js';
import { CreateClubDto } from './dtos/create-club.dto.js';

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
}
