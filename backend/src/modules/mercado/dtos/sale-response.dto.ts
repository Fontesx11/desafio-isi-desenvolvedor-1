import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '../../contratos/enums/contracts.enum.js';
import { TransactionResponseDto } from '../../transacoes/dtos/transaction-response.dto.js';
import { Sale } from '../interfaces/sale.interface.js';

export class SaleResponseDto extends TransactionResponseDto {
  @ApiProperty({ description: 'Valor de compra gravado no contrato, sem a taxa', example: 37 })
  purchase_value: number;
  @ApiProperty({ description: 'Dias restantes de fidelidade no momento da venda, arredondados para cima', example: 117 })
  remaining_days: number;
  @ApiProperty({ description: 'Percentual da multa pelos dias restantes (0, 5, 10 ou 20)', example: 10 })
  penalty_rate: number;
  @ApiProperty({
    description: 'Situação do contrato depois da venda: RESCINDIDO com multa, ENCERRADO sem multa',
    enum: [ContractStatus.ENCERRADO, ContractStatus.RESCINDIDO],
    example: ContractStatus.RESCINDIDO,
  })
  contract_status: ContractStatus;
  @ApiProperty({ description: 'Caixa do clube depois da venda', example: 296.85 })
  club_cash: number;

  constructor(sale: Sale) {
    super(sale.transaction);
    this.purchase_value = Number(sale.purchaseValue);
    this.remaining_days = sale.remainingDays;
    this.penalty_rate = sale.penaltyRate;
    this.contract_status = sale.contractStatus;
    this.club_cash = Number(sale.clubCash);
  }
}
