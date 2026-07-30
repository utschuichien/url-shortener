import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UrlsModule } from './urls/urls.module';
import { AuthModule } from './auth/auth.module';

import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: configService.get<string>('REDIS_URL'),
          ttl: 60000,
        }),
        ttl: 60000, // Thêm cấu hình TTL cho NestJS CacheModule
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = new URL(configService.get<string>('REDIS_URL') as string);
        return {
          connection: {
            host: redisUrl.hostname,
            port: parseInt(redisUrl.port, 10) || 6379,
            username: redisUrl.username || undefined,
            password: redisUrl.password || undefined,
          },
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60000),
          limit: configService.get<number>('THROTTLE_LIMIT', 20),
        },
      ],
    }),

    PrismaModule,
    AuthModule,
    UrlsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply ThrottlerGuard globally to all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
