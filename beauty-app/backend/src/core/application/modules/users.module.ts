import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../controllers/users.controller';
import { RegisterUserUseCase } from '../use-cases/users/register-user.use-case';
import { TypeOrmUserRepository } from '../../infrastructure/persistence/typeorm/repositories/user.repository';
import { UserSchema } from '../../infrastructure/persistence/typeorm/schemas/user.schema';
import { AuthModule } from '../../shared/auth/auth.module';
import { AuthService } from '../services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    AuthService,
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [RegisterUserUseCase],
})
export class UsersModule {} 