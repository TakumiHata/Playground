import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../domain/enums/role.enum';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'メールアドレス',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  @IsNotEmpty({ message: 'メールアドレスは必須です' })
  email: string;

  @ApiProperty({
    description: 'パスワード',
    example: 'password123',
    minLength: 8,
  })
  @IsString({ message: 'パスワードは文字列である必要があります' })
  @IsNotEmpty({ message: 'パスワードは必須です' })
  @MinLength(8, { message: 'パスワードは8文字以上である必要があります' })
  password: string;

  @ApiProperty({
    description: '名前',
    example: '山田 太郎',
  })
  @IsString({ message: '名前は文字列である必要があります' })
  @IsNotEmpty({ message: '名前は必須です' })
  name: string;

  @ApiProperty({
    description: '電話番号',
    example: '090-1234-5678',
    required: false,
  })
  @IsString({ message: '電話番号は文字列である必要があります' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: '住所',
    example: '東京都渋谷区...',
    required: false,
  })
  @IsString({ message: '住所は文字列である必要があります' })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'ユーザーロール',
    example: 'USER',
    enum: Role,
    default: Role.USER,
  })
  @IsEnum(Role, { message: '無効なロールです' })
  @IsOptional()
  role?: Role = Role.USER;
} 