import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EventTypeService {
  constructor(private prisma: PrismaService) {}
}