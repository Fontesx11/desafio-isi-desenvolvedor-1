import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { ClubsService } from './clubs.service.js';
import { ClubResponseDto } from './dtos/club-response.dto.js';
import { CreateClubDto } from './dtos/create-club.dto.js';
import { ListClubsQueryDto } from './dtos/list-clubs-query.dto.js';

@ApiTags('Clubes')
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar clube',
    description: 'O clube nasce com caixa de 300 e sem jogadores. A liga aceita no máximo 20 clubes, sem repetir nome nem sigla.',
  })
  @ApiBody({ type: CreateClubDto })
  @ApiResponse({
    status: 201,
    description: 'Clube cadastrado com sucesso.',
    type: ClubResponseDto,
    headers: { Location: { description: 'URL do clube criado', schema: { type: 'string' } } },
  })
  @ApiResponse({
    status: 400,
    description: 'Falha ao cadastrar clube',
    schema: {
      example: {
        message: 'a sigla deve ter exatamente 3 letras maiúsculas de A a Z',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Nome ou sigla já cadastrados, ou limite de clubes da liga atingido',
    schema: {
      example: {
        message: 'já existe um clube com este nome',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  async create(@Body() dto: CreateClubDto, @Res({ passthrough: true }) response: Response): Promise<ClubResponseDto> {
    const club = await this.clubsService.create(dto);
    response.location(`/api/v1/clubs/${club.id}`);
    return new ClubResponseDto(club);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clubes', description: 'Lista todos os clubes, ordenados por nome ou por patrimônio.' })
  @ApiResponse({ status: 200, description: 'Lista de clubes.', type: [ClubResponseDto] })
  @ApiResponse({
    status: 400,
    description: 'Ordenação inválida',
    schema: {
      example: {
        message: 'a ordenação deve ser um dos valores: name, net_worth_asc, net_worth_desc',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  async findAll(@Query() query: ListClubsQueryDto): Promise<ClubResponseDto[]> {
    const clubs = await this.clubsService.findAll(query);
    return clubs.map((club) => new ClubResponseDto(club));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar clube', description: 'Obtém os dados do clube pelo ID, com o elenco e o contrato de cada jogador.' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do clube', example: 1 })
  @ApiResponse({ status: 200, description: 'Dados do clube obtidos com sucesso.', type: ClubResponseDto })
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
  async findOne(@IdParam() id: number): Promise<ClubResponseDto> {
    const { club, squad } = await this.clubsService.findById(id);
    return new ClubResponseDto(club, squad);
  }
}
