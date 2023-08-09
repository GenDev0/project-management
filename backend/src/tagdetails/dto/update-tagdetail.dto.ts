import { PartialType } from '@nestjs/mapped-types';
import { CreateTagdetailDto } from './create-tagdetail.dto';

export class UpdateTagdetailDto extends PartialType(CreateTagdetailDto) {}
