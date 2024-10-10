import { IsString, IsOptional } from 'class-validator';

export class UpdateImageBackgroundDto {
  @IsString()
  @IsOptional()
  url?: string;
}
