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
  CreateBookingDto,
  EditBookingDto,
  RejectBookingDto,
} from './dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BookingEntity,
  BookingPaginationEntity,
} from './entity/booking.entity';

@UseGuards(RolesGuard)
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get(':page?/:pageSize?')
  @ApiParam({ type: String, name: 'page', required: false, example: 1 })
  @ApiParam({ type: String, name: 'pageSize', required: false, example: 10 })
  @ApiResponse({ status: HttpStatus.OK, type: BookingPaginationEntity })
  getBookings(
    @GetUser() user: User,
    @Param('page', ParseIntPipe) page = 1,
    @Param('pageSize', ParseIntPipe) pageSize = 10,
  ) {
    return this.bookingService.getBookings(user, page, pageSize);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: BookingEntity })
  getBookingById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookingId: string,
  ) {
    return this.bookingService.getBookingById(user, bookingId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: BookingEntity })
  createBooking(@GetUser() user: User, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(user, dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBody({ type: EditBookingDto })
  @ApiResponse({ status: HttpStatus.OK, type: BookingEntity })
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
  @ApiResponse({ status: HttpStatus.NO_CONTENT, type: BookingEntity })
  deleteBookingById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookingId: string,
  ) {
    return this.bookingService.deleteBookingById(user, bookingId);
  }

  @Post(':id/approve')
  @Roles(Role.ADMIN)
  @ApiBody({ type: ApproveBookingDto })
  @ApiResponse({ status: HttpStatus.OK, type: BookingEntity })
  approveBooking(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookingId: string,
    @Body() dto: ApproveBookingDto,
  ) {
    return this.bookingService.approveBooking(user, bookingId, dto);
  }

  @Post(':id/reject')
  @Roles(Role.ADMIN)
  @ApiBody({ type: RejectBookingDto })
  @ApiResponse({ status: HttpStatus.OK, type: BookingEntity })
  rejectBooking(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookingId: string,
    @Body() dto: RejectBookingDto,
  ) {
    return this.bookingService.rejectBooking(user, bookingId, dto);
  }

  @Post(':id/cancel')
  @ApiResponse({ status: HttpStatus.OK, type: BookingEntity })
  cancelBooking(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookingId: string,
  ) {
    return this.bookingService.cancelBooking(user, bookingId);
  }
}
