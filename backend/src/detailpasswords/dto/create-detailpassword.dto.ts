import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDetailpasswordDto {
  @IsNotEmpty()
  category_password: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  deleted: number;

  @IsNotEmpty()
  projectId: number;
}
