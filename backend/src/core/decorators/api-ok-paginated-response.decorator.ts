import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiOkPaginatedResponse = <DTO extends Type<unknown>>(dataDto: DTO, description: string) => {
  return applyDecorators(
    ApiExtraModels(dataDto),
    ApiOkResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(dataDto) },
          },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 10 },
              total_items: { type: 'integer', example: 42 },
              total_pages: { type: 'integer', example: 5 },
            },
          },
        },
      },
    }),
  );
};
