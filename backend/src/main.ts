import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { printBanner } from './app.banner.js';
import { configureApp } from './app.setup.js';
import { setupSwagger } from './app.swagger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const frontendUrl = config.get('CORS_ORIGIN');

  configureApp(app);
  app.enableCors({ origin: frontendUrl });
  app.enableShutdownHooks();

  const port = Number(config.get('PORT', 13000));
  setupSwagger(app);
  await app.listen(port);

  printBanner(port, frontendUrl);
}
await bootstrap();
