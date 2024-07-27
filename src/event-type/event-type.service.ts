import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventTypeDto, EditEventTypeDto } from './dto';
import { EventTypeEntity } from './entity';

@Injectable()
export class EventTypeService {
  constructor(private prisma: PrismaService) {}

  getEventTypes(): Promise<EventTypeEntity[]> {
    return this.prisma.eventType.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getEventTypeById(eventTypeId: string): Promise<EventTypeEntity> {
    return this.prisma.eventType.findFirst({
      where: {
        id: eventTypeId,
      },
    });
  }

  createEventType(dto: CreateEventTypeDto): Promise<EventTypeEntity> {
    return this.prisma.eventType.create({
      data: {
        ...dto,
      },
    });
  }

  editEventTypeById(eventTypeId: string, dto: EditEventTypeDto): Promise<EventTypeEntity> {
    return this.prisma.eventType.update({
      where: {
        id: eventTypeId,
      },
      data: {
        ...dto,
      },
    });
  }

  deleteEventTypeById(eventTypeId: string): Promise<EventTypeEntity> {
    return this.prisma.eventType.delete({
      where: {
        id: eventTypeId,
      },
    });
  }
}
