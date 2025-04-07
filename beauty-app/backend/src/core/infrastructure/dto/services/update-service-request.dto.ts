import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsBoolean, IsOptional } from 'class-validator';

export class UpdateServiceRequestDto {
  @ApiProperty({
    description: 'サービス名',
    example: 'カット（更新）',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'サービス説明',
    example: '髪の毛をカットします（更新）',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '価格',
    example: 6000,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: '所要時間（分）',
    example: 90,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: 'アクティブ状態',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 