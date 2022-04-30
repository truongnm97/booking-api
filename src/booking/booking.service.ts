import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBookingDto, EditBookingDto } from './dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  getBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: {
        userId,
      },
    });
  }

  getBookingById(userId: number, bookingId: number) {
    return this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
    });
  }

  createBooking(userId: number, dto: CreateBookingDto) {
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
    userId: number,
    bookingId: number,
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

  async deleteBookingById(userId: number, bookingId: number) {
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

  async cancelOrder(orderId: string) {
    if (!orderId) {
      throw new BadRequestException('Id is required');
    }
    const order = await this.prisma.booking.findUnique({
      where: { id: Number(orderId) },
    });
    console.log({ order });
    if (!order) {
      throw new BadRequestException('Order is not existed');
    }
    if (order.isCancelled) {
      throw new BadRequestException('Order is not active');
    }
    const res = await this.prisma.booking.update({
      where: { id: Number(orderId) },
      data: {
        isCancelled: true,
      },
    });
    return res;
  }
}
