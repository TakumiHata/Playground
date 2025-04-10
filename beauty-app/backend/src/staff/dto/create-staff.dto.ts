import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @IsOptional()
  schedule?: any;
} 