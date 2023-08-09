import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTagDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;
}
