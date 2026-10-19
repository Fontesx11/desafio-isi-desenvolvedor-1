import { ApiProperty } from '@nestjs/swagger';
import { formatBrasiliaDateTime } from '../../../core/utils/date.utils.js';
import { ContractStatus } from '../../contratos/enums/contracts.enum.js';
import { TransactionResponseDto } from '../../transacoes/dtos/transaction-response.dto.js';
import { Purchase } from '../interfaces/purchase.interface.js';

export class PurchaseResponseDto extends TransactionResponseDto {
  @ApiProperty({
    description: 'Contrato criado na compra',
    type: 'object',
    properties: {
      purchase_value: { type: 'number', description: 'Valor de mercado pago, sem a taxa', example: 37 },
      loyalty_until: { type: 'string', description: 'Fim da fidelidade (horário de Brasília)', example: '2027-03-02T10:15:00-03:00' },
      status: { type: 'string', enum: Object.values(ContractStatus), description: 'Situação do contrato', example: ContractStatus.ATIVO },
    },
  })
  contract: {
    purchase_value: number;
    loyalty_until: string;
    status: ContractStatus;
  };
  @ApiProperty({ description: 'Caixa do clube depois da compra', example: 261.15 })
  club_cash: number;

  constructor(purchase: Purchase) {
    super(purchase.transaction);
    this.contract = {
      purchase_value: Number(purchase.contract.purchaseValue),
      loyalty_until: formatBrasiliaDateTime(purchase.contract.loyaltyUntil),
      status: purchase.contract.status,
    };
    this.club_cash = Number(purchase.clubCash);
  }
}
