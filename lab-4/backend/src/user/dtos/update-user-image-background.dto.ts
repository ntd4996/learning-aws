import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserImageBackgroundDto {
  @IsString()
  @IsNotEmpty()
  imageBackgroundId: string;
}
