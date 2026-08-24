import { applyDecorators, Type } from '@nestjs/common';

import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiResponseDoc<TModel extends Type<any>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(model),

    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },

              data: {
                $ref: getSchemaPath(model),
              },

              timestamp: {
                type: 'string',
                example: '2026-07-08T10:00:00.000Z',
              },
            },
          },
        ],
      },
    }),
  );
}
