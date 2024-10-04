import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OkResponseDto {
  @ApiProperty({
    description: 'Message of the response',
    example: 'Success',
  })
  @Expose()
  message: string;

  constructor(message: string = 'Success') {
    this.message = message;
  }
}
