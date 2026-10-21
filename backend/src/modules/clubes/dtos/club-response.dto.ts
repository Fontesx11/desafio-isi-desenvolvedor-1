import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClubWithDynamicValues, SquadPlayer } from '../interfaces/club.interface.js';
import { SquadPlayerResponseDto } from './squad-player-response.dto.js';

export class ClubResponseDto {
  @ApiProperty({ description: 'ID do clube', example: 1 })
  id: number;
  @ApiProperty({ description: 'Nome do clube', example: 'Raimon Eleven' })
  name: string;
  @ApiProperty({ description: 'Sigla do clube', example: 'RAI' })
  acronym: string;
  @ApiProperty({ description: 'Caixa do clube (começa em 300)', example: 300 })
  cash: number;
  @ApiProperty({ description: 'Soma do valor de mercado dos jogadores do elenco', example: 350.75 })
  squad_value: number;
  @ApiProperty({ description: 'Patrimônio do clube (caixa + valor do elenco)', example: 650.75 })
  net_worth: number;
  @ApiPropertyOptional({ description: 'Elenco do clube (só na busca por ID)', type: [SquadPlayerResponseDto] })
  players?: SquadPlayerResponseDto[];

  constructor(club: ClubWithDynamicValues, squad?: SquadPlayer[]) {
    this.id = club.id;
    this.name = club.name;
    this.acronym = club.acronym;
    this.cash = Number(club.cash);
    this.squad_value = club.squadValue;
    this.net_worth = club.netWorth;

    if (squad) {
      this.players = squad.map((item) => new SquadPlayerResponseDto(item));
    }
  }
}
