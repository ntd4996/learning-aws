import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse as BaseApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiOkResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    BaseApiOkResponse({ schema: { $ref: getSchemaPath(dataDto) } }),
    ApiExtraModels(dataDto),
  );
