import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceRequestDto {
  @ApiProperty({
    description: 'サービス名',
    example: 'カット',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'サービス説明',
    example: 'ヘアカットサービス',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '価格',
    example: 5000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: '所要時間（分）',
    example: 60,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;
} 