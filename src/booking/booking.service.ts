import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BookingStatus, Role, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import {
  ApproveBookingDto,
  CancelBookingDto,
  CreateBookingDto,
  EditBookingDto,
  RejectBookingDto,
} from './dto';
import { BookingsResponse } from './interface/bookings.interface';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async getBookings(
    user: User,
    page: number,
    pageSize: number,
  ): Promise<BookingsResponse> {
    const bookings = await this.prisma.booking.findMany({
      where:
        user.role === Role.ADMIN
          ? {
              isCancelled: false,
            }
          : {
              userId: user.id,
              isCancelled: false,
            },
      select: {
        id: true,
        user: user.role === Role.ADMIN,
        status: true,
        eventType: true,
        location: true,
        proposalDates: true,
        selectedDate: true,
        userId: true,
        isCancelled: true,
        rejectReason: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await this.prisma.booking.count({
      where:
        user.role === Role.ADMIN
          ? {
              isCancelled: false,
            }
          : {
              userId: user.id,
              isCancelled: false,
            },
    });

    return {
      data: bookings,
      page,
      pageSize,
      total,
    };
  }

  getBookingById(user: User, bookingId: string) {
    return this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: user.id,
      },
    });
  }

  createBooking(user: User, { eventTypeId, ...dto }: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        ...dto,
        eventType: {
          connect: {
            id: eventTypeId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async editBookingById(
    user: User,
    bookingId: string,
    { eventTypeId, ...dto }: EditBookingDto,
  ) {
    return this.prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        ...dto,
        eventType: {
          connect: {
            id: eventTypeId,
          },
        },
      },
    });
  }

  async deleteBookingById(user: User, bookingId: string) {
    return this.prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });
  }

  async approveBooking(user: User, dto: ApproveBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (booking.isCancelled) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status !== BookingStatus.PENDING_REVIEW) {
      throw new BadRequestException("Booking isn't pending review");
    }

    return this.prisma.booking.update({
      where: {
        id: dto.id,
      },
      data: {
        selectedDate: dto.selectedDate,
        status: BookingStatus.APPROVED,
      },
    });
  }

  async rejectBooking(user: User, dto: RejectBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (booking.isCancelled) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status !== BookingStatus.PENDING_REVIEW) {
      throw new BadRequestException("Booking isn't pending review");
    }

    return this.prisma.booking.update({
      where: {
        id: dto.id,
      },
      data: {
        rejectReason: dto.rejectReason,
        status: BookingStatus.REJECTED,
      },
    });
  }

  async cancelBooking(user: User, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (user.role === Role.USER && (!booking || booking.userId !== user.id)) {
      throw new ForbiddenException('Access to resource denied');
    }

    if (booking.isCancelled) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status !== BookingStatus.PENDING_REVIEW) {
      throw new BadRequestException("Booking isn't pending review");
    }

    return this.prisma.booking.update({
      where: {
        id: dto.id,
      },
      data: {
        isCancelled: true,
      },
    });
  }
}
