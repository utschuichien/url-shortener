import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Inject,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import * as crypto from 'crypto';

@Injectable()
export class UrlsService {
  private readonly logger = new Logger(UrlsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  private encodeBase62(num: number): string {
    const ALPHABET =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    if (num === 0) return ALPHABET[0];

    let encoded = '';
    while (num > 0) {
      const remainder = num % 62;
      encoded = ALPHABET[remainder] + encoded;
      num = Math.floor(num / 62);
    }
    return encoded;
  }

  async createShortUrl(originalUrl: string, userId?: number, customAlias?: string) {
    const reserved = ['admin', 'api', 'login', 'dashboard', 'static', 'assets'];
    if (customAlias && reserved.includes(customAlias.toLowerCase())) {
      throw new BadRequestException('Alias này không được phép sử dụng do bảo mật.');
    }
    if (customAlias) {

      try {
        return await this.prisma.url.create({
          data: {
            originalUrl,
            shortCode: customAlias,
            userId,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            `Alias "${customAlias}" đã được sử dụng.`,
          );
        }

        throw error;
      }
    }


    return this.prisma.$transaction(async (tx) => {
      const temp = await tx.url.create({
        data: {
          originalUrl,
          shortCode: crypto.randomBytes(7).toString('hex'),
          userId,
        },
      });

      const shortCode = this.encodeBase62(temp.id);

      return tx.url.update({
        where: {
          id: temp.id,
        },
        data: {
          shortCode,
        },
      });
    });
  }

  async findAllByUser(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [urls, total] = await this.prisma.$transaction([
      this.prisma.url.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.url.count({
        where: {
          userId,
          isDeleted: false,
        },
      }),
    ]);

    return {
      data: urls,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOriginalUrl(shortCode: string) {
    const cacheData = await this.cacheManager.get<{
      originalUrl: string;
      id: number;
    }>(shortCode);
    
    if (cacheData) {
      this.logger.log(`[CACHE HIT] Lấy dữ liệu từ Redis cho mã: ${shortCode}`);
      return cacheData;
    }

    this.logger.log(`[CACHE MISS] Đọc từ Database và lưu vào Redis cho mã: ${shortCode}`);
    const urlRecord = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!urlRecord || urlRecord.isDeleted) {
      throw new NotFoundException('Mã rút gọn không tồn tại hoặc đã bị xóa');
    }
    await this.cacheManager.set(shortCode, {
      originalUrl: urlRecord.originalUrl,
      id: urlRecord.id,
    });
    return { originalUrl: urlRecord.originalUrl, id: urlRecord.id };
  }

  async updateUrl(
    id: number,
    newOriginalUrl: string,
    currentUserId: number,
    currentUserRole: string,
  ) {
    // 1. Kiểm tra xem link có tồn tại và chưa bị xóa hay không
    const urlRecord = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!urlRecord || urlRecord.isDeleted) {
      throw new NotFoundException('Đường dẫn không tồn tại hoặc đã bị xóa');
    }

    // 2. Kiểm tra quyền sở hữu: chỉ chủ sở hữu hoặc ADMIN mới được sửa
    this.checkOwnership(urlRecord.userId, currentUserId, currentUserRole);
    const updatedUrl = this.prisma.url.update({
      where: { id },
      data: { originalUrl: newOriginalUrl },
    });
    await this.cacheManager.del(urlRecord.shortCode);

    return updatedUrl;
  }

  async deleteUrl(id: number, currentUserId: number, currentUserRole: string) {
    const urlRecord = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!urlRecord || urlRecord.isDeleted) {
      throw new NotFoundException('Đường dẫn không tồn tại hoặc đã bị xóa');
    }

    // 2. Kiểm tra quyền sở hữu
    this.checkOwnership(urlRecord.userId, currentUserId, currentUserRole);
    // 3. Cập nhật isDeleted = true thay vì xóa vĩnh viễn
    const deletedUrl = this.prisma.url.update({
      where: { id },
      data: { isDeleted: true },
    });
    await this.cacheManager.del(urlRecord.shortCode);
    return deletedUrl;
  }

  /**
   * Kiểm tra quyền sở hữu:
   * - ADMIN: được phép thao tác trên mọi URL
   * - USER: chỉ được thao tác trên URL của mình
   * - URL ẩn danh (userId = null): không ai được sửa/xóa trừ ADMIN
   */
  private checkOwnership(
    urlOwnerId: number | null,
    currentUserId: number,
    currentUserRole: string,
  ) {
    if (currentUserRole === Role.ADMIN) {
      return; // Admin bypass
    }

    if (urlOwnerId === null || urlOwnerId !== currentUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền thao tác trên đường dẫn này',
      );
    }
  }
  async getUrlStats(shortCode: string, currentUserId: number) {
    const urlRecord = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!urlRecord || urlRecord.isDeleted) {
      throw new NotFoundException('Đường dẫn không tồn tại hoặc đã bị xóa');
    }
    if (urlRecord.userId !== currentUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền xem thống kê của link này',
      );
    }
    const totalClicks = await this.prisma.click.count({
      where: { urlId: urlRecord.id },
    });
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const clicksByDateRaw = await this.prisma.$queryRaw<
      { date: string | Date; clicks: bigint }[]
    >`
      SELECT 
        DATE(clicked_at) as date, 
        COUNT(*) as clicks
      FROM clicks
      WHERE url_id = ${urlRecord.id} AND clicked_at >= ${sevenDaysAgo}
      GROUP BY DATE(clicked_at)
      ORDER BY DATE(clicked_at) ASC;
    `;

    const clicksByDate = clicksByDateRaw.map((item) => {
      // Prisma $queryRaw DATE() có thể trả về string hoặc Date object
      const dateString = item.date instanceof Date
        ? item.date.toISOString().split('T')[0]
        : String(item.date).split('T')[0];

      return {
        date: dateString,
        count: Number(item.clicks),
      };
    });
    const topBrowsersRaw = await this.prisma.click.groupBy({
      by: ['userAgent'],
      where: { urlId: urlRecord.id },
      _count: {
        userAgent: true,
      },
      orderBy: {
        _count: {
          userAgent: 'desc',
        },
      },
      take: 5,
    });

    const topBrowsers = topBrowsersRaw.map((item) => ({
      browser: item.userAgent || 'Unknown',
      clicks: item._count.userAgent,
    }));

    return {
      shortCode: urlRecord.shortCode,
      originalUrl: urlRecord.originalUrl,
      totalClicks,
      clicksByDate,
      topBrowsers,
    };
  }
}
