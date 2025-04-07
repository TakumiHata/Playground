import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase, LoginRequest, LoginResponse } from '../../application/use-cases/auth/login.use-case';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ユーザーログイン' })
  @ApiResponse({ status: 200, description: 'ログイン成功' })
  @ApiResponse({ status: 401, description: '認証エラー' })
  async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return this.loginUseCase.execute(request);
  }
} 