import { BookingStatus, EventType } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class EditBookingDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsArray()
  @IsOptional()
  proposalDates?: string[];

  @IsString()
  @IsOptional()
  selectedDate?: string;

  @IsEnum(EventType)
  @IsOptional()
  eventType?: EventType;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
