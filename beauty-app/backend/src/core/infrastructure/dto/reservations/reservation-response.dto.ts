import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../../domain/entities/reservation.entity';

export class ReservationResponseDto {
  @ApiProperty({ description: '予約ID' })
  id: string;

  @ApiProperty({ description: 'ユーザーID' })
  userId: string;

  @ApiProperty({ description: 'スタッフID' })
  staffId: string;

  @ApiProperty({ description: 'サービスIDの配列' })
  serviceIds: string[];

  @ApiProperty({ description: '予約日時' })
  date: Date;

  @ApiProperty({ description: '予約ステータス', enum: ReservationStatus })
  status: ReservationStatus;

  @ApiProperty({ description: '備考', required: false })
  notes?: string;

  static fromEntity(reservation: Reservation): ReservationResponseDto {
    const dto = new ReservationResponseDto();
    dto.id = reservation.id;
    dto.userId = reservation.userId;
    dto.staffId = reservation.staffId;
    dto.serviceIds = reservation.serviceIds;
    dto.date = reservation.date;
    dto.status = reservation.status;
    dto.notes = reservation.notes;
    return dto;
  }
} 