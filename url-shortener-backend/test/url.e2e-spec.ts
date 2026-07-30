/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('URL Shortener (E2E) - Race Condition', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
    // Đóng kết nối Prisma để Jest không bị treo
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Tạm thời tắt kiểm tra khóa ngoại để có thể xóa dữ liệu ở bảng con trước
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;

    // Xóa dữ liệu từ các bảng có quan hệ (nếu có thêm bảng phụ thuộc, thêm vào đây)
    // Ví dụ: bảng click (nếu có)
    await prisma.click?.deleteMany(); // nếu có model Click
    await prisma.url.deleteMany();

    // Bật lại kiểm tra khóa ngoại
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
  });

  it('should allow only one request to succeed with the same customAlias, others get 409', async () => {
    const customAlias = 'test-race';
    const payload = {
      originalUrl: 'https://example.com',
      customAlias: customAlias,
    };

    const endpoint = '/api/urls'; // hoặc endpoint thực tế của bạn

    const [res1, res2] = await Promise.all([
      request(app.getHttpServer()).post(endpoint).send(payload),
      request(app.getHttpServer()).post(endpoint).send(payload),
    ]);

    const successRes = [res1, res2].find((r) => r.status === 201);
    const failRes = [res1, res2].find((r) => r.status !== 201);

    expect(successRes).toBeDefined();
    expect(failRes).toBeDefined();

    // Kiểm tra request thành công
    expect(successRes!.status).toBe(201);
    // Sửa: lấy shortCode từ data
    expect(successRes!.body.data).toHaveProperty('shortCode', customAlias);
    // Hoặc: expect(successRes.body.data.shortCode).toBe(customAlias);

    // Kiểm tra request thất bại
    expect(failRes!.status).toBe(409);
    expect(failRes!.body.message).toContain('đã được sử dụng');

    // Kiểm tra trong DB chỉ có 1 bản ghi
    const urls = await prisma.url.findMany({
      where: { shortCode: customAlias },
    });
    expect(urls).toHaveLength(1);
  });
});
