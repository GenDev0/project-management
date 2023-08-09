import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  projectDescription: string;

  @IsOptional()
  projectIcon: string;

  @IsOptional()
  projectPicture: string;

  @IsOptional()
  deleted: string;
}
