import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateStaffDto {
  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  specialization?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceIds?: string[];
} 