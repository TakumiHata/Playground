import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(createStaffDto: CreateStaffDto) {
    const { userId, specialties, schedule } = createStaffDto;
    return this.prisma['staff'].create({
      data: {
        userId,
        specialties,
        schedule,
      },
    });
  }

  async findAll() {
    return this.prisma['staff'].findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const staff = await this.prisma['staff'].findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.prisma['staff'].findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    const { specialties, schedule } = updateStaffDto;

    return this.prisma['staff'].update({
      where: { id },
      data: {
        specialties,
        schedule,
      },
      include: {
        user: true,
      },
    });
  }

  async remove(id: string) {
    const staff = await this.prisma['staff'].findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    return this.prisma['staff'].delete({
      where: { id },
    });
  }
} 