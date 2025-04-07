import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsDate, IsOptional } from 'class-validator';

export class CreateReservationRequestDto {
  @ApiProperty({ description: 'ユーザーID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'スタッフID' })
  @IsString()
  staffId: string;

  @ApiProperty({ description: 'サービスIDの配列' })
  @IsArray()
  @IsString({ each: true })
  serviceIds: string[];

  @ApiProperty({ description: '予約日時' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: '備考', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
} 