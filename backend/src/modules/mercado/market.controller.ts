import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { BuyPlayerDto } from './dtos/buy-player.dto.js';
import { ListTransactionsQueryDto } from './dtos/list-transactions-query.dto.js';
import { PurchaseResponseDto } from './dtos/purchase-response.dto.js';
import { SaleResponseDto } from './dtos/sale-response.dto.js';
import { TransactionHistoryResponseDto } from './dtos/transaction-history-response.dto.js';
import { MarketService } from './market.service.js';

@ApiTags('Mercado')
@Controller()
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post('players/:id/buy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Comprar jogador',
    description:
      'Compra um jogador livre pelo valor de mercado do momento, mais a taxa de 5% quando o valor passa de 30,00. O custo total não pode passar de 50% do caixa, e o elenco tem no máximo 12 jogadores. Cria o contrato ATIVO e grava a transação COMPRA.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do jogador', example: 2 })
  @ApiBody({ type: BuyPlayerDto })
  @ApiResponse({ status: 200, description: 'Jogador comprado com sucesso.', type: PurchaseResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Clube ou fim da fidelidade ausentes ou inválidos',
    schema: {
      example: {
        message: 'o fim da fidelidade deve ser depois do momento da compra',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Jogador ou clube não encontrado',
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
    description: 'Jogador que não está livre, custo acima de 50% do caixa, elenco com 12 jogadores ou recompra pelo clube que já vendeu o jogador',
    schema: {
      example: {
        message: 'o custo total não pode exceder 50% do caixa do clube',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  async buyPlayer(@IdParam() id: number, @Body() dto: BuyPlayerDto): Promise<PurchaseResponseDto> {
    const purchase = await this.marketService.buyPlayer(id, dto);
    return new PurchaseResponseDto(purchase);
  }

  @Post('players/:id/sell')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vender jogador',
    description:
      'Vende o jogador pelo clube atual, pelo valor de mercado do momento. Antes do fim da fidelidade, cobra multa; com lucro, cobra comissão progressiva. O jogador volta a ficar livre, sai da escalação e a transação VENDA é gravada. A venda não tem corpo.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do jogador', example: 2 })
  @ApiResponse({ status: 200, description: 'Jogador vendido com sucesso.', type: SaleResponseDto })
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
    description: 'Jogador livre (sem clube)',
    schema: {
      example: {
        message: 'um jogador livre não pode ser vendido',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  async sellPlayer(@IdParam() id: number): Promise<SaleResponseDto> {
    const sale = await this.marketService.sellPlayer(id);
    return new SaleResponseDto(sale);
  }

  @Get('clubs/:id/transactions')
  @ApiOperation({
    summary: 'Histórico de transações',
    description: 'Lista as compras e vendas do clube, da mais recente para a mais antiga, com os totais das transações filtradas em summary.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do clube', example: 1 })
  @ApiResponse({ status: 200, description: 'Histórico obtido com sucesso.', type: TransactionHistoryResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Filtro inválido',
    schema: {
      example: {
        message: 'cada tipo deve ser um dos valores: COMPRA, VENDA',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Clube ou jogador do filtro não encontrado',
    schema: {
      example: {
        message: 'Clube não encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async getTransactionHistory(@IdParam() id: number, @Query() query: ListTransactionsQueryDto): Promise<TransactionHistoryResponseDto> {
    const history = await this.marketService.getTransactionHistory(id, query);
    return new TransactionHistoryResponseDto(history);
  }

  @Get('clubs/:id/transactions/export')
  @ApiOperation({
    summary: 'Exportar histórico em CSV',
    description: 'Baixa o histórico do clube em CSV, com os mesmos filtros e a mesma ordem da consulta. As respostas de erro continuam em JSON.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do clube', example: 1 })
  @ApiProduces('text/csv')
  @ApiResponse({
    status: 200,
    description: 'Arquivo CSV com o histórico.',
    schema: {
      type: 'string',
      example:
        'data_hora;tipo;jogador;valor;taxa_ou_comissao;multa;lucro;variacao_caixa\n2026-11-05T16:40:00-03:00;VENDA;Meia Lua;40,00;0,30;4,00;3,00;35,70\n',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Filtro inválido',
    schema: {
      example: {
        message: 'cada tipo deve ser um dos valores: COMPRA, VENDA',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Clube ou jogador do filtro não encontrado',
    schema: {
      example: {
        message: 'Clube não encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async exportTransactionHistory(
    @IdParam() id: number,
    @Query() query: ListTransactionsQueryDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const csv = await this.marketService.exportClubTransactions(id, query);
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader('Content-Disposition', `attachment; filename="transacoes_clube_${id}.csv"`);
    return csv;
  }
}
