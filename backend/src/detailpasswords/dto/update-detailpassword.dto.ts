import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailpasswordDto } from './create-detailpassword.dto';

export class UpdateDetailpasswordDto extends PartialType(CreateDetailpasswordDto) {}
