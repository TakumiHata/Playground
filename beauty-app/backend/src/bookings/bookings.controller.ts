import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @GetUser('id') userId: string,
    @Body() data: Prisma.BookingCreateInput
  ) {
    return this.bookingsService.create(userId, data);
  }

  @Get()
  async findAll() {
    return this.bookingsService.findAll();
  }

  @Get('my-bookings')
  async findMyBookings(@GetUser('id') userId: string) {
    return this.bookingsService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.BookingUpdateInput
  ) {
    return this.bookingsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
} 