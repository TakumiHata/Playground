import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { RegisterUserUseCase } from '../use-cases/users/register-user.use-case';
import { RegisterRequestDto } from '../dto/auth/register-request.dto';
import { AuthService } from '../services/auth.service';
import { LoginRequestDto } from '../dto/auth/login-request.dto';
import { JwtAuthGuard } from '../../shared/auth/guards/jwt-auth.guard';
import { Roles } from '../../shared/auth/decorators/roles.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';
import { RolesGuard } from '../../shared/auth/guards/roles.guard';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterRequestDto) {
    return this.registerUserUseCase.execute(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginRequestDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminOnly(@Request() req: RequestWithUser) {
    return { message: 'Admin access granted' };
  }
} 