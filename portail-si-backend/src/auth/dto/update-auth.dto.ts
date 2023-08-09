import { PartialType } from '@nestjs/mapped-types';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAuthDto {
  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsOptional()
  profilPicture: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  fonction: string;

  @IsString()
  @IsOptional()
  matricule: string;

  @IsString()
  @IsOptional()
  deleted: string;

  @IsString()
  @IsOptional()
  role_id: number;
}
