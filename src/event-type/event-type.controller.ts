import { Controller, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard } from 'auth/guard';

@UseGuards(RolesGuard)
@UseGuards(JwtGuard)
@Controller('event-type')
export class EventTypeController {}
