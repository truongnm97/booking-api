import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  proposalDates: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventTypeId: string;
}
