import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto) {
    const { serviceIds, ...reservationData } = createReservationDto;

    return this.prisma.reservation.create({
      data: {
        ...reservationData,
        services: {
          connect: serviceIds.map(id => ({ id })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        staff: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.reservation.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        staff: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        staff: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    const { serviceIds, ...reservationData } = updateReservationDto;

    return this.prisma.reservation.update({
      where: { id },
      data: {
        ...reservationData,
        services: serviceIds ? {
          set: serviceIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        staff: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return this.prisma.reservation.delete({
      where: { id },
    });
  }
} 