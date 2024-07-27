import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  proposalDates?: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: new Date().toISOString() })
  selectedDate?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  eventTypeId?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  @ApiPropertyOptional({
    enum: BookingStatus,
    example: BookingStatus.PENDING_REVIEW,
  })
  status?: BookingStatus;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  isCancelled?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  rejectReason?: string;
}
