import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsEmail,
  IsIn,
} from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  first_name: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  last_name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  matricule: string;

  @IsOptional()
  profilPicture: string;

  @IsOptional()
  fonction: string;

  @IsOptional()
  @IsIn(['0', '1'])
  deleted: string;

  @IsOptional()
  role_id: number;
}
