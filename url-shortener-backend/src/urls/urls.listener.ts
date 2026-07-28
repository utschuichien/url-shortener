import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { UrlClickedEvent } from '../events/url-clicked.event';

@Injectable()
export class UrlsListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('url.clicked', { async: true }) 
  async handleUrlClickedEvent(event: UrlClickedEvent) {
    try {
      await this.prisma.click.create({
        data: {
          urlId: event.urlId,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
        },
      });
      console.log('Ghi log thành công');
    } catch (error) {
      console.error('Lỗi khi ghi log truy cập:', error);
    }
  }
}
