import { BookingStatus } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditBookingDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  proposalDates?: string[];

  @IsString()
  @IsOptional()
  selectedDate?: string;

  @IsString()
  @IsOptional()
  eventTypeId?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsBoolean()
  @IsOptional()
  isCancelled?: boolean;

  @IsString()
  @IsOptional()
  rejectReason?: string;
}
