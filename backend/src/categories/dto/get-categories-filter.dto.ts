import { IsNotEmpty, IsOptional } from 'class-validator';

export class getCategoriesFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
