import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ApproveBookingDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  selectedDate: string;
}
