import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { UrlsListener } from './urls.listener';

@Module({
  imports: [JwtModule],
  controllers: [UrlsController],
  providers: [UrlsService, UrlsListener],
})
export class UrlsModule {}
