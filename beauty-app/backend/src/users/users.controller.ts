import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
  }) {
    return this.usersService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@GetUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(
    @GetUser() user: any,
    @Body() data: {
      name?: string;
      phone?: string;
      address?: string;
      avatar?: string;
    },
  ) {
    return this.usersService.update(user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteProfile(@GetUser() user: any) {
    return this.usersService.delete(user.id);
  }
} 