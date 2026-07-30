import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('clicks-queue', {
  concurrency: 20, // Giới hạn số lượng truy vấn DB cùng lúc để tránh nghẽn
})
export class ClicksProcessor extends WorkerHost {
  private readonly logger = new Logger(ClicksProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(
    job: Job<{ urlId: number; ipAddress: string; userAgent: string }>,
  ): Promise<void> {
    try {
      await this.prisma.click.create({
        data: {
          urlId: job.data.urlId,
          ipAddress: job.data.ipAddress,
          userAgent: job.data.userAgent,
        },
      });
      // Không console.log ở đây để tránh làm chậm I/O của Node.js
    } catch (error) {
      this.logger.error('Lỗi khi lưu truy cập từ Queue:', error);
      throw error;
    }
  }
}
