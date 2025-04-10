import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty({
    description: 'サービスID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'サービス名',
    example: 'カット',
  })
  name: string;

  @ApiProperty({
    description: 'サービス説明',
    example: 'ヘアカットサービス',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '価格',
    example: 5000,
  })
  price: number;

  @ApiProperty({
    description: '所要時間（分）',
    example: 60,
  })
  duration: number;

  @ApiProperty({
    description: '作成日時',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新日時',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
} 