import { EventType } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @IsNotEmpty()
  proposalDates: string[];

  @IsEnum(EventType)
  @IsNotEmpty()
  eventType: EventType;
}
