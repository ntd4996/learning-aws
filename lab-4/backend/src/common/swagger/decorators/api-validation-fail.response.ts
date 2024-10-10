import { applyDecorators } from '@nestjs/common';
import { ApiUnprocessableEntityResponse } from '@nestjs/swagger';

export function ApiValidationFailResponse() {
  return applyDecorators(
    ApiUnprocessableEntityResponse({
      schema: {
        type: 'object',
        properties: {
          timestamp: {
            type: 'string',
            example: '2024-07-11T08:15:33.083Z',
          },
          message: {
            type: 'string',
            example: 'Unprocessable Entity',
          },
          errors: {
            type: 'object',
            example: {
              name: {
                isNotEmpty: 'name should not be empty',
              },
              address: {
                isNotEmptyObject: 'address must be a non-empty object',
              },
            },
          },
        },
      },
    }),
  );
}
