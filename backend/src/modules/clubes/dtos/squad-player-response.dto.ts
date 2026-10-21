import { ApiProperty } from '@nestjs/swagger';
import { formatBrasiliaDateTime } from '../../../core/utils/date.utils.js';
import { PlayerResponseDto } from '../../jogadores/dtos/player-response.dto.js';
import { SquadPlayer } from '../interfaces/club.interface.js';

export class SquadPlayerResponseDto extends PlayerResponseDto {
  @ApiProperty({
    description: 'Contrato vigente do jogador, ou null se não houver',
    nullable: true,
    type: 'object',
    properties: {
      purchase_value: { type: 'number', description: 'Valor pago na compra', example: 120.5 },
      loyalty_until: { type: 'string', description: 'Fim da fidelidade (horário de Brasília)', example: '2027-01-15T12:00:00-03:00' },
      remaining_days: { type: 'integer', description: 'Dias restantes de fidelidade', example: 90 },
      penalty_rate: { type: 'number', description: 'Percentual de multa se o jogador fosse vendido agora', example: 10 },
    },
  })
  contract: {
    purchase_value: number;
    loyalty_until: string;
    remaining_days: number;
    penalty_rate: number;
  } | null;

  constructor({ player, contract }: SquadPlayer) {
    super(player);

    if (contract === null) {
      this.contract = null;
      return;
    }

    this.contract = {
      purchase_value: Number(contract.purchaseValue),
      loyalty_until: formatBrasiliaDateTime(contract.loyaltyUntil),
      remaining_days: contract.remainingDays,
      penalty_rate: contract.penaltyRate,
    };
  }
}
