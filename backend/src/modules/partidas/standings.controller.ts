import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StandingResponseDto } from './dtos/standing-response.dto.js';
import { MatchesService } from './matches.service.js';

@ApiTags('Liga')
@Controller('standings')
export class StandingsController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @ApiOperation({
    summary: 'Classificação',
    description:
      'Classificação com todos os clubes, inclusive os que ainda não jogaram. Ordem: mais pontos, maior saldo de gols, mais gols marcados e nome do clube. Calculada a cada consulta.',
  })
  @ApiResponse({ status: 200, description: 'Classificação obtida com sucesso.', type: [StandingResponseDto] })
  async calculateStandings(): Promise<StandingResponseDto[]> {
    const standings = await this.matchesService.calculateStandings();
    return standings.map((standing) => new StandingResponseDto(standing));
  }
}
