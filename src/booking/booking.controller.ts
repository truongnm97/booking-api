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
  Query,
  Req,
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
  getBookings(@GetUser('id') userId: number) {
    return this.bookingService.getBookings(userId);
  }

  @Get(':id')
  getBookingById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookingId: number,
  ) {
    return this.bookingService.getBookingById(userId, bookingId);
  }

  @Post()
  createBooking(@GetUser('id') userId: number, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(userId, dto);
  }

  @Patch(':id')
  editBookingById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookingId: number,
    @Body() dto: EditBookingDto,
  ) {
    return this.bookingService.editBookingById(userId, bookingId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookingById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookingId: number,
  ) {
    return this.bookingService.deleteBookingById(userId, bookingId);
  }

  @Post('cancel')
  cancelOrder(@Req() user, @Query('id') id: string) {
    console.log({ user });
    return this.bookingService.cancelOrder(id);
  }
}
