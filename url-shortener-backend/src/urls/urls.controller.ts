import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Redirect,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';
import { type Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectQueue('clicks-queue') private readonly clicksQueue: Queue,
  ) { }

  // Tạo URL — cho phép cả guest lẫn user đã đăng nhập
  @Post('api/urls')
  async create(@Body() createUrlDto: CreateUrlDto, @Req() req: Request) {
    // Optional auth: thử decode JWT nếu có, không bắt buộc
    let userId: number | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const payload = this.jwtService.verify<{ sub: number }>(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
        userId = payload.sub;
      } catch {
        // Token invalid/expired — treat as guest, no error
      }
    }

    const result = await this.urlsService.createShortUrl(
      createUrlDto.originalUrl,
      userId,
      createUrlDto.customAlias,
    );

    const appUrl = this.configService.get<string>(
      'APP_URL',
      'http://localhost:3000',
    );

    return {
      message: 'Rút gọn link thành công!',
      data: {
        id: result.id,
        shortCode: result.shortCode,
        originalUrl: result.originalUrl,
        shortUrl: `${appUrl}/${result.shortCode}`,
        createdAt: result.createdAt,
      },
    };
  }

  // Lấy danh sách URL của user (cho Dashboard)
  @Get('api/urls')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: { userId: number },
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    const result = await this.urlsService.findAllByUser(
      user.userId,
      pageNumber,
      limitNumber,
    );
    const appUrl = this.configService.get<string>(
      'APP_URL',
      'http://localhost:3000',
    );

    return {
      message: 'Thành công',
      data: result.data.map((url) => ({
        ...url,
        shortUrl: `${appUrl}/${url.shortCode}`,
      })),
      meta: result.meta,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('api/urls/:shortCode/stats')
  async getStats(
    @Param('shortCode') shortCode: string,
    @CurrentUser() user: { userId: number },
  ) {
    const stats = await this.urlsService.getUrlStats(shortCode, user.userId);

    return {
      message: 'Lấy dữ liệu thống kê thành công',
      data: stats,
    };
  }

  // Redirect — skip rate limiting cho trải nghiệm người dùng cuối
  @SkipThrottle()
  @Get(':shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string, @Req() req: Request) {
    const { originalUrl, id } =
      await this.urlsService.getOriginalUrl(shortCode);
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    void this.clicksQueue.add('log-click', {
      urlId: id,
      ipAddress: ip,
      userAgent,
    });
    return { url: originalUrl, statusCode: HttpStatus.FOUND };
  }

  // Cập nhật URL — chỉ chủ sở hữu hoặc ADMIN
  @Put('api/urls/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUrlDto: UpdateUrlDto,
    @CurrentUser() user: { userId: number; role: string },
  ) {
    const updatedUrl = await this.urlsService.updateUrl(
      id,
      updateUrlDto.originalUrl,
      user.userId,
      user.role,
    );

    return {
      message: 'Cập nhật đường dẫn gốc thành công',
      data: {
        id: updatedUrl.id,
        shortCode: updatedUrl.shortCode,
        originalUrl: updatedUrl.originalUrl,
      },
    };
  }

  // Xóa mềm URL — chỉ chủ sở hữu hoặc ADMIN
  @Delete('api/urls/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId: number; role: string },
  ) {
    await this.urlsService.deleteUrl(id, user.userId, user.role);

    return {
      message: 'Đã xóa đường dẫn rút gọn thành công',
    };
  }
}
