import { Module } from '@nestjs/common';
import { EventTypeController } from './event-type.controller';
import { EventTypeService } from './event-type.service';

@Module({
  providers: [EventTypeService],
  controllers: [EventTypeController],
})
export class EventTypeModule {}
