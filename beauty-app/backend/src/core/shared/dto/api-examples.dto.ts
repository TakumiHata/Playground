import { ApiProperty } from '@nestjs/swagger';

export class ApiExamplesDto {
  @ApiProperty({
    description: '認証トークンの取得例',
    example: {
      request: {
        email: 'user@example.com',
        password: 'password123'
      },
      response: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  authentication: object;

  @ApiProperty({
    description: 'ユーザー作成例',
    example: {
      request: {
        name: '山田太郎',
        email: 'yamada@example.com',
        password: 'password123',
        role: 'USER'
      },
      response: {
        id: '1',
        name: '山田太郎',
        email: 'yamada@example.com',
        role: 'USER',
        createdAt: '2024-04-07T12:00:00Z'
      }
    }
  })
  userCreation: object;

  @ApiProperty({
    description: 'サービス作成例',
    example: {
      request: {
        name: 'フェイシャルエステ',
        description: '肌の状態に合わせたフェイシャルエステ',
        price: 5000,
        duration: 60
      },
      response: {
        id: '1',
        name: 'フェイシャルエステ',
        description: '肌の状態に合わせたフェイシャルエステ',
        price: 5000,
        duration: 60,
        createdAt: '2024-04-07T12:00:00Z'
      }
    }
  })
  serviceCreation: object;
} 