import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClubsModule } from './modules/clubes/clubs.module.js';
import { PlayersModule } from './modules/jogadores/players.module.js';
import { LeagueModule } from './modules/liga/league.module.js';
import { MarketModule } from './modules/mercado/market.module.js';
import { MatchesModule } from './modules/partidas/matches.module.js';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder().setTitle('Desafio Dev 1').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [PlayersModule, ClubsModule, MarketModule, LeagueModule, MatchesModule],
  });

  SwaggerModule.setup('docs', app, document);
}
