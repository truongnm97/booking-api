import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EventTypeModule } from './event-type/event-type.module';
import { RedisCacheModule } from 'redis-cache/redis-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisCacheModule,
    AuthModule,
    UserModule,
    BookingModule,
    PrismaModule,
    EventTypeModule,
  ],
})
export class AppModule {}
