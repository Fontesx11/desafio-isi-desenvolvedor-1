import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IdParam } from '../../core/decorators/id-param.decorator.js';
import { BuyPlayerDto } from './dtos/buy-player.dto.js';
import { PurchaseResponseDto } from './dtos/purchase-response.dto.js';
import { SaleResponseDto } from './dtos/sale-response.dto.js';
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
}
