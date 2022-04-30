import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBookingDto, EditBookingDto } from './dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  getBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: {
        userId,
      },
    });
  }

  getBookingById(userId: string, bookingId: string) {
    return this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
    });
  }

  createBooking(userId: string, dto: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async editBookingById(
    userId: string,
    bookingId: string,
    dto: EditBookingDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking || booking.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookingById(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking || booking.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });
  }
}
