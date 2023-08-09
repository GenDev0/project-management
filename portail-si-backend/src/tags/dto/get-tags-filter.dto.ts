import { IsNotEmpty, IsOptional } from 'class-validator';

export class getTagsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
