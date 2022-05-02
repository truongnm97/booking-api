import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtGuard, Roles, RolesGuard } from 'auth/guard';
import { CreateEventTypeDto, EditEventTypeDto } from './dto';
import { EventTypeService } from './event-type.service';

@UseGuards(RolesGuard)
@UseGuards(JwtGuard)
@Controller('event-type')
export class EventTypeController {
  constructor(private eventTypeService: EventTypeService) {}

  @Get()
  getEventTypes() {
    return this.eventTypeService.getEventTypes();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  getEventTypeById(@Param('id') eventTypeId: string) {
    return this.eventTypeService.getEventTypeById(eventTypeId);
  }

  @Post()
  @Roles(Role.ADMIN)
  createEventType(@Body() dto: CreateEventTypeDto) {
    return this.eventTypeService.createEventType(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  editEventTypeById(
    @Param('id') eventTypeId: string,
    @Body() dto: EditEventTypeDto,
  ) {
    return this.eventTypeService.editEventTypeById(eventTypeId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteEventTypeById(@Param('id') eventTypeId: string) {
    return this.eventTypeService.deleteEventTypeById(eventTypeId);
  }
}
