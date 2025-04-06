import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(createStaffDto: CreateStaffDto) {
    const { serviceIds, ...staffData } = createStaffDto;

    return this.prisma.staff.create({
      data: {
        ...staffData,
        services: {
          connect: serviceIds?.map(id => ({ id })),
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
    return this.prisma.staff.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
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
    const staff = await this.prisma.staff.findUnique({
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

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    const { serviceIds, ...staffData } = updateStaffDto;

    return this.prisma.staff.update({
      where: { id },
      data: {
        ...staffData,
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
    const staff = await this.prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    return this.prisma.staff.delete({
      where: { id },
    });
  }
} 