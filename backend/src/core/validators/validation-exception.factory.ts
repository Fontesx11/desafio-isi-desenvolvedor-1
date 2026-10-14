import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function validationExceptionFactory(
  errors: ValidationError[],
): BadRequestException {
  const [firstError] = errors;
  const [firstMessage] = Object.values(firstError.constraints ?? {});
  return new BadRequestException(firstMessage);
}
