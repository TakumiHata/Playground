import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsNotEmpty, Min, IsPositive } from 'class-validator';

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
    example: '髪の毛をカットします',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '価格',
    example: 5000,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: '所要時間（分）',
    example: 60,
  })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({
    description: 'アクティブ状態',
    example: true,
    default: true,
  })
  @IsBoolean()
  isActive: boolean;
} 