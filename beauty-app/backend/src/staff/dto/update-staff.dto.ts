import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateStaffDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];

  @IsOptional()
  schedule?: any;
} 