import { IsNotEmpty, IsOptional } from 'class-validator';

export class getRolesFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
