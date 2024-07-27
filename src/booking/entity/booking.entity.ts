import { ApiProperty } from '@nestjs/swagger';
import { Booking, BookingStatus } from '@prisma/client';

export class BookingEntity implements Booking {
  @ApiProperty({
    example: '1',
  })
  id: string;

  @ApiProperty()
  location: string;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ type: [String] })
  proposalDates: string[];

  @ApiProperty({ nullable: true })
  selectedDate: string | null;

  @ApiProperty()
  isCancelled: boolean;

  @ApiProperty({ nullable: true })
  rejectReason: string | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  eventTypeId: string;
}

export class BookingPaginationEntity {
  @ApiProperty({ type: [BookingEntity] })
  data: Partial<BookingEntity>[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  total: number;
}
