import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasourceUrl: config.get('DATABASE_URL'),
    });
  }

  cleanDb() {
    return this.$transaction([
      this.booking.deleteMany(),
      this.eventType.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
