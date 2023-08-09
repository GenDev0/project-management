import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  categoryDescription: string;

  @IsNotEmpty()
  projectId: number;

  @IsOptional()
  categoryIcon: string;

  @IsOptional()
  deleted: number;
}
