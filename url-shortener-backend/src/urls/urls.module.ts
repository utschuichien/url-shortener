import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { ClicksProcessor } from './clicks.processor';

@Module({
  imports: [
    JwtModule,
    BullModule.registerQueue({
      name: 'clicks-queue',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000,
      },
    }),
  ],
  controllers: [UrlsController],
  providers: [UrlsService, ClicksProcessor],
})
export class UrlsModule {}
