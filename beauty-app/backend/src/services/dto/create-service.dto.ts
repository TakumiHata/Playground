import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  duration: number;

  @IsString()
  @IsOptional()
  category?: string;
} 