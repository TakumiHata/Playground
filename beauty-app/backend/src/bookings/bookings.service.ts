import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Booking, Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    return this.prisma.booking.create({ data });
  }

  async findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      include: {
        user: true,
        product: true,
      },
    });
  }

  async findOne(id: number): Promise<Booking | null> {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        user: true,
        product: true,
      },
    });
  }

  async update(id: number, data: Prisma.BookingUpdateInput): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data,
      include: {
        user: true,
        product: true,
      },
    });
  }

  async remove(id: number): Promise<Booking> {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
} 