import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { CreateMatchDto } from './dtos/create-match.dto.js';
import { ListMatchesQueryDto } from './dtos/list-matches-query.dto.js';
import { MatchResponseDto } from './dtos/match-response.dto.js';
import { MatchesService } from './matches.service.js';

@ApiTags('Liga')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @ApiOperation({
    summary: 'Jogar partida',
    description:
      'Joga a partida entre dois clubes com a escalação completa e grava o resultado. O placar sai de 6 duelos entre os titulares, sem sorteio: os 3 ataques do mandante e depois os 3 do visitante. Não muda o caixa, a escalação nem os jogadores.',
  })
  @ApiBody({ type: CreateMatchDto })
  @ApiResponse({
    status: 201,
    description: 'Partida jogada com sucesso.',
    type: MatchResponseDto,
    headers: { Location: { description: 'URL da partida criada', schema: { type: 'string' } } },
  })
  @ApiResponse({
    status: 400,
    description: 'Mandante ou visitante ausentes ou inválidos, ou os dois iguais',
    schema: {
      example: {
        message: 'o visitante deve ser diferente do mandante',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Clube não encontrado',
    schema: {
      example: {
        message: 'Clube não encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Escalação incompleta no mandante ou no visitante',
    schema: {
      example: {
        message: 'os dois clubes devem ter a escalação completa, com os 5 titulares',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  async playMatch(@Body() dto: CreateMatchDto, @Res({ passthrough: true }) response: Response): Promise<MatchResponseDto> {
    const { match, result, duels } = await this.matchesService.playMatch(dto);
    response.location(`/api/v1/matches/${match.id}`);
    return new MatchResponseDto(match, result, duels);
  }

  @Get()
  @ApiOperation({
    summary: 'Histórico de partidas',
    description: 'Lista as partidas da mais recente para a mais antiga, com o placar e o result, sem os duelos.',
  })
  @ApiResponse({ status: 200, description: 'Lista de partidas.', type: [MatchResponseDto] })
  @ApiResponse({
    status: 400,
    description: 'Filtro inválido',
    schema: {
      example: {
        message: 'o clube deve ser um id maior que zero',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Clube do filtro não encontrado',
    schema: {
      example: {
        message: 'Clube não encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async findAll(@Query() query: ListMatchesQueryDto): Promise<MatchResponseDto[]> {
    const matches = await this.matchesService.findAll(query);
    return matches.map(({ match, result }) => new MatchResponseDto(match, result));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar partida', description: 'Obtém a partida pelo ID, com os 6 duelos na ordem.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da partida', example: 1 })
  @ApiResponse({ status: 200, description: 'Partida obtida com sucesso.', type: MatchResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Falha ao encontrar partida',
    schema: {
      example: {
        message: 'Partida não encontrada',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async findOne(@IdParam() id: number): Promise<MatchResponseDto> {
    const { match, result, duels } = await this.matchesService.findById(id);
    return new MatchResponseDto(match, result, duels);
  }
}
