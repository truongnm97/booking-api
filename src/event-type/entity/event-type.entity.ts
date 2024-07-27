import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';

export class EventTypeEntity implements EventType {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
