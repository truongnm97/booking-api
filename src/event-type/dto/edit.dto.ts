import { IsNotEmpty, IsString } from 'class-validator';

export class EditEventTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
