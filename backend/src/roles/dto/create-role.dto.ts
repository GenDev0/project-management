import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  roleName: string;

  @IsNotEmpty()
  roleDescription: string;

  @IsOptional()
  roleIcon: string;

  @IsOptional()
  deleted: string;
}
