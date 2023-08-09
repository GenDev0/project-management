import { IsNotEmpty, IsOptional } from 'class-validator';

export class getTagDetailsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
