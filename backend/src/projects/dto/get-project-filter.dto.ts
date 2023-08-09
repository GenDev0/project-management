import { IsNotEmpty, IsOptional } from 'class-validator';

export class getProjectsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsNotEmpty()
  page: number;
}
