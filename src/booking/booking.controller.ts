import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'auth/decorator';
import { JwtGuard } from 'auth/guard';
import { BookingService } from './booking.service';
import { CreateBookingDto, EditBookingDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  getBookings(@GetUser('id') userId: string) {
    return this.bookingService.getBookings(userId);
  }

  @Get(':id')
  getBookingById(
    @GetUser('id') userId: string,
    @Param('id', ParseIntPipe) bookingId: string,
  ) {
    return this.bookingService.getBookingById(userId, bookingId);
  }

  @Post()
  createBooking(@GetUser('id') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(userId, dto);
  }

  @Patch(':id')
  editBookingById(
    @GetUser('id') userId: string,
    @Param('id', ParseIntPipe) bookingId: string,
    @Body() dto: EditBookingDto,
  ) {
    return this.bookingService.editBookingById(userId, bookingId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookingById(
    @GetUser('id') userId: string,
    @Param('id', ParseIntPipe) bookingId: string,
  ) {
    return this.bookingService.deleteBookingById(userId, bookingId);
  }

  @Post(':id/cancel')
  cancelOrder(
    @GetUser('id') userId: string,
    @Param('id', ParseIntPipe) bookingId: string,
  ) {
    return this.bookingService.editBookingById(userId, bookingId, {
      isCancelled: true,
    });
  }
}
