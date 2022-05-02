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
import { Role, User } from '@prisma/client';
import { GetUser } from 'auth/decorator';
import { JwtGuard, Roles, RolesGuard } from 'auth/guard';
import { BookingService } from './booking.service';
import {
  ApproveBookingDto,
  CancelBookingDto,
  CreateBookingDto,
  EditBookingDto,
  RejectBookingDto,
} from './dto';

@UseGuards(RolesGuard)
@UseGuards(JwtGuard)
@Controller('bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get(':page?/:pageSize?')
  getBookings(
    @GetUser() user: User,
    @Param('page', ParseIntPipe) page = 1,
    @Param('pageSize', ParseIntPipe) pageSize = 10,
  ) {
    return this.bookingService.getBookings(user, page, pageSize);
  }

  @Get(':id')
  getBookingById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookingId: string,
  ) {
    return this.bookingService.getBookingById(user, bookingId);
  }

  @Post()
  createBooking(@GetUser() user: User, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(user, dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  editBookingById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookingId: string,
    @Body() dto: EditBookingDto,
  ) {
    return this.bookingService.editBookingById(user, bookingId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteBookingById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookingId: string,
  ) {
    return this.bookingService.deleteBookingById(user, bookingId);
  }

  @Post('approve')
  @Roles(Role.ADMIN)
  approveBooking(@GetUser() user: User, @Body() dto: ApproveBookingDto) {
    return this.bookingService.approveBooking(user, dto);
  }

  @Post('reject')
  @Roles(Role.ADMIN)
  rejectBooking(@GetUser() user: User, @Body() dto: RejectBookingDto) {
    return this.bookingService.rejectBooking(user, dto);
  }

  @Post('cancel')
  cancelBooking(@GetUser() user: User, @Body() dto: CancelBookingDto) {
    return this.bookingService.cancelBooking(user, dto);
  }
}
