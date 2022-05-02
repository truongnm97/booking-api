import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventTypeDto, EditEventTypeDto } from './dto';

@Injectable()
export class EventTypeService {
  constructor(private prisma: PrismaService) {}

  getEventTypes() {
    return this.prisma.eventType.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getEventTypeById(eventTypeId: string) {
    return this.prisma.eventType.findFirst({
      where: {
        id: eventTypeId,
      },
    });
  }

  createEventType(dto: CreateEventTypeDto) {
    return this.prisma.eventType.create({
      data: {
        ...dto,
      },
    });
  }

  editEventTypeById(eventTypeId: string, dto: EditEventTypeDto) {
    return this.prisma.eventType.update({
      where: {
        id: eventTypeId,
      },
      data: {
        ...dto,
      },
    });
  }

  deleteEventTypeById(eventTypeId: string) {
    return this.prisma.eventType.delete({
      where: {
        id: eventTypeId,
      },
    });
  }
}
