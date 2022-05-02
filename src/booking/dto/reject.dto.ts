import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RejectBookingDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  rejectReason: string;
}
