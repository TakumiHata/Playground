import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceRequestDto {
  @ApiProperty({
    description: 'サービス名',
    example: 'カット',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: '所要時間（分）',
    example: 60,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;
} 