import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @GetUser('id') userId: string,
    @Body() data: Prisma.BookingCreateInput
  ): Promise<Booking> {
    return this.bookingsService.create({
      ...data,
      user: { connect: { id: userId } },
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  async findMyBookings(@GetUser('id') userId: string): Promise<Booking[]> {
    return this.bookingsService.findByUser(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Booking | null> {
    return this.bookingsService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.BookingUpdateInput
  ): Promise<Booking> {
    return this.bookingsService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.remove(Number(id));
  }
} 