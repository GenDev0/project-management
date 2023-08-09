import { IsNotEmpty, IsOptional } from 'class-validator';

export class getDetailpasswordFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
