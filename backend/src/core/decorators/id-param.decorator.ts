import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';

const MAX_ID = 2147483647;

export const IdParam = createParamDecorator((name: string = 'id', context: ExecutionContext): number => {
  const value = context.switchToHttp().getRequest<Request>().params[name];
  const id = Number(value);

  if (typeof value !== 'string' || !/^[1-9][0-9]*$/.test(value) || id > MAX_ID) {
    throw new NotFoundException('Resource not found');
  }

  return id;
});
