import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditEventTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
