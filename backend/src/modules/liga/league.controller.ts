import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { LineupResponseDto } from './dtos/lineup-response.dto.js';
import { UpdateLineupDto } from './dtos/update-lineup.dto.js';
import { LeagueService } from './league.service.js';

@ApiTags('Liga')
@Controller()
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Put('clubs/:id/lineup')
  @ApiOperation({
    summary: 'Escalar titulares',
    description: 'Escolhe a formação e escala os 5 titulares do clube: 1 goleiro e 4 jogadores de linha. Substitui a escalação inteira e não muda o caixa.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do clube', example: 1 })
  @ApiBody({ type: UpdateLineupDto })
  @ApiResponse({ status: 200, description: 'Escalação salva com sucesso.', type: LineupResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Formação ou lista de jogadores inválida',
    schema: {
      example: {
        message: 'os titulares devem ser exatamente 5 ids',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Clube ou jogador não encontrado',
    schema: {
      example: {
        message: 'Jogador não encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Jogador fora do elenco do clube, jogador DOENTE ou posições que não fecham a formação',
    schema: {
      example: {
        message: 'as posições dos jogadores não fecham a formação',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  async updateLineup(@IdParam() id: number, @Body() dto: UpdateLineupDto): Promise<LineupResponseDto> {
    const lineup = await this.leagueService.updateLineup(id, dto);
    return new LineupResponseDto(lineup);
  }

  @Get('clubs/:id/lineup')
  @ApiOperation({
    summary: 'Buscar escalação',
    description: 'Obtém a escalação atual do clube, com a formação. Sem escalação, formation vem null, players vem vazio e complete vem false.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do clube', example: 1 })
  @ApiResponse({ status: 200, description: 'Escalação obtida com sucesso.', type: LineupResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Falha ao encontrar clube',
    schema: {
      example: {
        message: 'Clube não encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async findLineup(@IdParam() id: number): Promise<LineupResponseDto> {
    const lineup = await this.leagueService.findLineup(id);
    return new LineupResponseDto(lineup);
  }
}
