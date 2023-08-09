import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  tagDescription: string;

  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  categoryId: number;

  @IsOptional()
  tagIcon: string;

  @IsOptional()
  deleted: number;
}
