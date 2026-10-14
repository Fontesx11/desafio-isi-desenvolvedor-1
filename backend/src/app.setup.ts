import { INestApplication, ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './core/validators/validation-exception.factory.js';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
}
