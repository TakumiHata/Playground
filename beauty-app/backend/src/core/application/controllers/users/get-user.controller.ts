import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUserUseCase } from '../../use-cases/users/get-user.use-case';
import { CurrentUser } from '../../shared/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/guards/roles.guard';
import { Roles } from '../../shared/auth/decorators/roles.decorator';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetUserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get('me')
  @Roles(UserRole.USER, UserRole.STAFF, UserRole.ADMIN)
  @ApiOperation({ summary: 'ユーザー情報の取得', description: '指定されたIDのユーザー情報を取得します。管理者のみがアクセス可能です。' })
  @ApiResponse({ status: 200, description: 'ユーザー情報の取得に成功しました。' })
  @ApiResponse({ status: 401, description: '認証に失敗しました。' })
  @ApiResponse({ status: 403, description: '権限が不足しています。' })
  @ApiResponse({ status: 404, description: '指定されたユーザーが見つかりません。' })
  async getCurrentUser(@CurrentUser() user: any) {
    return this.getUserUseCase.execute(user.id);
  }
} 