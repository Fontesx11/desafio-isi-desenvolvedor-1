import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { IsBrasiliaDateTime } from '../../../core/validators/is-brasilia-date-time.decorator.js';

export class BuyPlayerDto {
  @ApiProperty({ description: 'ID do clube comprador', example: 1 })
  @IsInt({ message: 'o clube deve ser um id inteiro' })
  @Min(1, { message: 'o clube deve ser um id maior que zero' })
  club_id: number;

  @ApiProperty({
    description: 'Fim da fidelidade do contrato (horário de Brasília): depois do momento da compra e até 1.095 dias depois dele',
    example: '2027-03-02T10:15-03:00',
  })
  @IsBrasiliaDateTime()
  loyalty_until: string;
}
