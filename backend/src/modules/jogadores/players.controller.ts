import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Put, Query, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { ApiOkPaginatedResponse } from '../../core/decorators/api-ok-paginated-response.decorator.js';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { Page } from '../../core/utils/pagination.utils.js';
import { CreatePlayerDto } from './dtos/create-player.dto.js';
import { ListPlayersQueryDto } from './dtos/list-players-query.dto.js';
import { PlayerResponseDto } from './dtos/player-response.dto.js';
import { UpdatePlayerConditionDto, UpdatePlayerDto } from './dtos/update-player.dto.js';
import { PlayersService } from './players.service.js';

@ApiTags('Jogadores')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar jogador',
    description: 'O jogador nasce sem clube e com condição APTO. O valor base é calculado a partir dos atributos.',
  })
  @ApiBody({ type: CreatePlayerDto })
  @ApiResponse({
    status: 201,
    description: 'Jogador cadastrado com sucesso.',
    type: PlayerResponseDto,
    headers: { Location: { description: 'URL do jogador criado', schema: { type: 'string' } } },
  })
  @ApiResponse({
    status: 400,
    description: 'Falha ao cadastrar jogador',
    schema: {
      example: {
        message: 'the sum of the six attributes must be at most 480',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  async create(@Body() dto: CreatePlayerDto, @Res({ passthrough: true }) response: Response): Promise<PlayerResponseDto> {
    const player = await this.playersService.create(dto);
    response.location(`/api/v1/players/${player.id}`);
    return new PlayerResponseDto(player);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar jogadores',
    description: 'Lista paginada com busca por nome e filtros por posição, condição, clube, idade e valor.',
  })
  @ApiOkPaginatedResponse(PlayerResponseDto, 'Lista paginada de jogadores.')
  @ApiResponse({
    status: 400,
    description: 'Filtros inválidos',
    schema: {
      example: {
        message: 'min_age must not be greater than max_age',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  async findAll(@Query() query: ListPlayersQueryDto): Promise<Page<PlayerResponseDto>> {
    const page = await this.playersService.findAll(query);
    return {
      data: page.data.map((player) => new PlayerResponseDto(player)),
      meta: page.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar jogador', description: 'Obtém os dados de um jogador pelo ID.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do jogador', example: 1 })
  @ApiResponse({ status: 200, description: 'Dados do jogador obtidos com sucesso.', type: PlayerResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Falha ao encontrar jogador',
    schema: {
      example: {
        message: 'Jogador não encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async findOne(@IdParam() id: number): Promise<PlayerResponseDto> {
    const player = await this.playersService.findById(id);
    return new PlayerResponseDto(player);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar jogador', description: 'Altera nome, posição, agilidade e idade.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do jogador', example: 1 })
  @ApiBody({ type: UpdatePlayerDto })
  @ApiResponse({ status: 200, description: 'Jogador atualizado com sucesso.', type: PlayerResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Falha ao atualizar jogador',
    schema: {
      example: {
        message: 'agility must not be greater than 100',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Falha ao encontrar jogador',
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
    description: 'Jogador com clube não pode mudar de posição, e a idade não pode diminuir',
    schema: {
      example: {
        message: 'a player with a club cannot change position',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  async update(@IdParam() id: number, @Body() dto: UpdatePlayerDto): Promise<PlayerResponseDto> {
    const player = await this.playersService.update(id, dto);
    return new PlayerResponseDto(player);
  }

  @Patch(':id/condition')
  @ApiOperation({ summary: 'Alterar condição do jogador', description: 'Ao ficar DOENTE, o jogador sai da escalação do clube.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do jogador', example: 1 })
  @ApiBody({ type: UpdatePlayerConditionDto })
  @ApiResponse({ status: 200, description: 'Condição do jogador alterada com sucesso.', type: PlayerResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Falha ao alterar condição do jogador',
    schema: {
      example: {
        message: 'condition must be one of the following values: APTO, MAL_CONDICIONADO, DOENTE',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Falha ao encontrar jogador',
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
    description: 'Jogador DOENTE não pode voltar direto para APTO',
    schema: {
      example: {
        message: 'condition cannot change directly from DOENTE to APTO',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  async changeCondition(@IdParam() id: number, @Body() dto: UpdatePlayerConditionDto): Promise<PlayerResponseDto> {
    const player = await this.playersService.changePlayerCondition(id, dto.condition);
    return new PlayerResponseDto(player);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover jogador', description: 'Remove um jogador sem clube.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do jogador', example: 1 })
  @ApiResponse({ status: 204, description: 'Jogador removido com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Falha ao encontrar jogador',
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
    description: 'Jogador com clube não pode ser removido',
    schema: {
      example: {
        message: 'a player with a club cannot be deleted',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  async remove(@IdParam() id: number): Promise<void> {
    await this.playersService.remove(id);
  }
}
