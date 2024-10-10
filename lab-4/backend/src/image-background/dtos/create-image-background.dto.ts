import { IsString, IsNotEmpty } from 'class-validator';

export class CreateImageBackgroundDto {
  @IsString()
  @IsNotEmpty()
  url: string;
}
