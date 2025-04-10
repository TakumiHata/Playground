import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    return this.prisma['booking'].create({
      data: {
        ...createBookingDto,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma['booking'].findMany();
  }

  async findOne(id: string) {
    const booking = await this.prisma['booking'].findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async findByUser(userId: string) {
    return this.prisma['booking'].findMany({
      where: { userId },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.prisma['booking'].findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return this.prisma['booking'].update({
      where: { id },
      data: updateBookingDto,
    });
  }

  async remove(id: string) {
    const booking = await this.prisma['booking'].findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return this.prisma['booking'].delete({
      where: { id },
    });
  }
} 