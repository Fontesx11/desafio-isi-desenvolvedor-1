import { Controller, Get } from '@nestjs/common';
import { StandingResponseDto } from './dtos/standing-response.dto.js';
import { MatchesService } from './matches.service.js';

@Controller('standings')
export class StandingsController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  async calculateStandings(): Promise<StandingResponseDto[]> {
    const standings = await this.matchesService.calculateStandings();
    return standings.map((standing) => new StandingResponseDto(standing));
  }
}
