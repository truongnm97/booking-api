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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventTypeEntity } from './entity';

@UseGuards(RolesGuard)
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('event-type')
@Controller('event-type')
export class EventTypeController {
  constructor(private eventTypeService: EventTypeService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [EventTypeEntity] })
  getEventTypes() {
    return this.eventTypeService.getEventTypes();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({ status: HttpStatus.OK, type: EventTypeEntity })
  getEventTypeById(@Param('id') eventTypeId: string) {
    return this.eventTypeService.getEventTypeById(eventTypeId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(Role.ADMIN)
  @ApiBody({ type: CreateEventTypeDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: EventTypeEntity })
  createEventType(@Body() dto: CreateEventTypeDto) {
    return this.eventTypeService.createEventType(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBody({ type: EditEventTypeDto })
  @ApiResponse({ status: HttpStatus.OK, type: EventTypeEntity })
  editEventTypeById(
    @Param('id') eventTypeId: string,
    @Body() dto: EditEventTypeDto,
  ) {
    return this.eventTypeService.editEventTypeById(eventTypeId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, type: EventTypeEntity })
  deleteEventTypeById(@Param('id') eventTypeId: string) {
    return this.eventTypeService.deleteEventTypeById(eventTypeId);
  }
}
