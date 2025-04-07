import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ 
    description: 'エラーコード',
    example: 'USER_NOT_FOUND',
    enum: [
      'USER_NOT_FOUND',
      'UNAUTHORIZED',
      'FORBIDDEN',
      'VALIDATION_ERROR',
      'INTERNAL_SERVER_ERROR'
    ]
  })
  code: string;

  @ApiProperty({ 
    description: 'エラーメッセージ',
    example: '指定されたユーザーが見つかりません。'
  })
  message: string;

  @ApiProperty({ 
    description: 'エラーの詳細',
    example: 'ID: 123 のユーザーは存在しません。',
    required: false
  })
  details?: string;

  @ApiProperty({ 
    description: 'エラーが発生した時間',
    example: '2024-04-07T12:00:00Z'
  })
  timestamp: string;
} 