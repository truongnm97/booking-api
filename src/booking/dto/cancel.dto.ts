import { IsNotEmpty, IsUUID } from 'class-validator';

export class CancelBookingDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
