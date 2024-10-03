import { ApiProperty } from '@nestjs/swagger';

import { PaginatedDto } from './paginated.dto';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({ type: PaginatedDto })
  meta: PaginatedDto;
}
