import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ListItemsResponseDto<T> {
  @ApiProperty()
  @Expose()
  data: T[];

  constructor(data: T[]) {
    this.data = data;
  }
}
