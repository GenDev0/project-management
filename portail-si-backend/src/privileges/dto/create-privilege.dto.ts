import {
  ArrayContains,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsIn,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreatePrivilegeDto {
  @IsNotEmpty()
  privilege_name: string;

  @IsNotEmpty()
  @IsIn(['create', 'delete', 'manage', 'read', 'update'])
  privilege_type: string;

  @IsNotEmpty()
  privilege_subject: string;

  @IsNotEmpty()
  id_subject: number;

  @IsOptional()
  deleted: string;
}
