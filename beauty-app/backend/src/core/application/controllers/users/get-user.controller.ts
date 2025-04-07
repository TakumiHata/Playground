import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUserUseCase } from '../use-cases/users/get-user.use-case';
import { User } from '../../../domain/entities/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../../domain/enums/user-role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetUserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async execute(@Param('id') id: string): Promise<User> {
    return this.getUserUseCase.execute(id);
  }
} 