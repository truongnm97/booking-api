import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @IsNotEmpty()
  proposalDates: string[];

  @IsString()
  @IsNotEmpty()
  eventTypeId: string;
}
