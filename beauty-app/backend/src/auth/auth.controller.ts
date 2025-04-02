import { Controller, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
  }) {
    return this.authService.register(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません');
    }
    return this.authService.login(user);
  }
} 