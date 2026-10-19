import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PlayersModule } from './modules/jogadores/players.module.js';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder().setTitle('Desafio Dev 1').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [PlayersModule],
  });

  SwaggerModule.setup('docs', app, document);
}
