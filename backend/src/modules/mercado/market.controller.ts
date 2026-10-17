import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { TransactionResponseDto } from '../transacoes/dtos/transaction-response.dto.js';
import { BuyPlayerDto } from './dtos/buy-player.dto.js';
import { ListTransactionsQueryDto } from './dtos/list-transactions-query.dto.js';
import { PurchaseResponseDto } from './dtos/purchase-response.dto.js';
import { SaleResponseDto } from './dtos/sale-response.dto.js';
import { TransactionSummaryResponseDto } from './dtos/transaction-history-response.dto.js';
import { TransactionHistoryResponse } from './interfaces/transaction-history.interface.js';
import { MarketService } from './market.service.js';

@Controller()
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post('players/:id/buy')
  @HttpCode(HttpStatus.OK)
  async buyPlayer(
    @IdParam() id: number,
    @Body() dto: BuyPlayerDto,
  ): Promise<PurchaseResponseDto> {
    const purchase = await this.marketService.buyPlayer(id, dto);
    return new PurchaseResponseDto(purchase);
  }

  @Post('players/:id/sell')
  @HttpCode(HttpStatus.OK)
  async sellPlayer(@IdParam() id: number): Promise<SaleResponseDto> {
    const sale = await this.marketService.sellPlayer(id);
    return new SaleResponseDto(sale);
  }

  @Get('clubs/:id/transactions')
  async getTransactionHistory(
    @IdParam() id: number,
    @Query() query: ListTransactionsQueryDto,
  ): Promise<TransactionHistoryResponse> {
    const { transactions, summary } =
      await this.marketService.getTransactionHistory(id, query);
    return {
      data: transactions.map(
        (transaction) => new TransactionResponseDto(transaction),
      ),
      summary: new TransactionSummaryResponseDto(summary),
    };
  }

  @Get('clubs/:id/transactions/export')
  async exportTransactionHistory(
    @IdParam() id: number,
    @Query() query: ListTransactionsQueryDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const csv = await this.marketService.exportClubTransactions(id, query);
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="transacoes_clube_${id}.csv"`,
    );
    return csv;
  }
}
