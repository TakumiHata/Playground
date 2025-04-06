import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  userId: string;

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