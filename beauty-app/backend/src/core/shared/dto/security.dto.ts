import { ApiProperty } from '@nestjs/swagger';

export class SecurityRequirementsDto {
  @ApiProperty({
    description: '認証要件',
    example: 'Bearer Token',
    enum: ['Bearer Token', 'API Key', 'Basic Auth']
  })
  authentication: string;

  @ApiProperty({
    description: '必要な権限',
    example: ['ADMIN', 'USER'],
    enum: ['ADMIN', 'USER']
  })
  requiredRoles: string[];

  @ApiProperty({
    description: 'レート制限',
    example: '100 requests per minute'
  })
  rateLimit: string;

  @ApiProperty({
    description: 'IP制限',
    example: '特定のIPアドレスからのアクセスのみ許可',
    required: false
  })
  ipRestriction?: string;

  @ApiProperty({
    description: 'SSL/TLS要件',
    example: 'HTTPS必須'
  })
  sslRequirement: string;
} 