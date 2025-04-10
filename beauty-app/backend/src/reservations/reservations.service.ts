import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: any) {
    const reservation = this.reservationRepository.create(createReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  async findAll() {
    return await this.reservationRepository.find();
  }

  async findOne(id: string) {
    return await this.reservationRepository.findOne({ where: { id } });
  }

  async update(id: string, updateReservationDto: any) {
    await this.reservationRepository.update(id, updateReservationDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    return await this.reservationRepository.delete(id);
  }
} 