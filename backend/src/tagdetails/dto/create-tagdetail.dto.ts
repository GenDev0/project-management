import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTagdetailDto {
  @IsNotEmpty()
  detail_name: string;

  @IsNotEmpty()
  detail_value: string;

  @IsNotEmpty()
  have_password: boolean;

  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  tag_id: number;

  @IsOptional()
  deleted: number;
}
