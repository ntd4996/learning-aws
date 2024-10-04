import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  lastPage: number;

  @ApiProperty()
  prev: number | null;

  @ApiProperty()
  next: number | null;
}
