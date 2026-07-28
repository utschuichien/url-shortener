import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';

const mockPrismaService = {
  url: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  click: {
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  $transaction: jest.fn((callback) => {
    if (Array.isArray(callback)) {
      return Promise.all(callback);
    }
    return callback(mockPrismaService);
  }),
  $queryRaw: jest.fn(),
};

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

describe('UrlsService', () => {
  let service: UrlsService;
  let prismaService: any;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    prismaService = module.get(PrismaService);
    cacheManager = module.get(CACHE_MANAGER);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createShortUrl', () => {
    it('should throw BadRequestException for reserved aliases', async () => {
      await expect(service.createShortUrl('http://example.com', 1, 'admin')).rejects.toThrow(BadRequestException);
    });

    it('should create a custom alias successfully', async () => {
      const mockResult = { id: 1, shortCode: 'mycustom', originalUrl: 'http://example.com', userId: 1 };
      prismaService.url.create.mockResolvedValue(mockResult);

      const result = await service.createShortUrl('http://example.com', 1, 'mycustom');
      expect(result).toEqual(mockResult);
      expect(prismaService.url.create).toHaveBeenCalledWith({
        data: { originalUrl: 'http://example.com', shortCode: 'mycustom', userId: 1 }
      });
    });

    it('should throw ConflictException if alias already exists', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '6.19.3',
      });
      prismaService.url.create.mockRejectedValue(error);

      await expect(service.createShortUrl('http://example.com', 1, 'taken')).rejects.toThrow(ConflictException);
    });

    it('should generate a shortCode if customAlias is not provided', async () => {
      // Mock creation of temp url
      prismaService.url.create.mockResolvedValue({ id: 12345, userId: 1, originalUrl: 'http://example.com' });
      // Mock update to final shortCode (12345 encoded -> 3D7)
      const finalResult = { id: 12345, shortCode: '3d7', userId: 1, originalUrl: 'http://example.com' };
      prismaService.url.update.mockResolvedValue(finalResult);

      const result = await service.createShortUrl('http://example.com', 1);
      
      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(prismaService.url.create).toHaveBeenCalled();
      expect(prismaService.url.update).toHaveBeenCalled();
      expect(result).toEqual(finalResult);
    });
  });

  describe('getOriginalUrl', () => {
    it('should return from cache if available (CACHE HIT)', async () => {
      const cachedData = { originalUrl: 'http://cached.com', id: 99 };
      cacheManager.get.mockResolvedValue(cachedData);

      const result = await service.getOriginalUrl('cachedcode');

      expect(cacheManager.get).toHaveBeenCalledWith('cachedcode');
      expect(prismaService.url.findUnique).not.toHaveBeenCalled();
      expect(result).toEqual(cachedData);
    });

    it('should fetch from DB and save to cache if not in cache (CACHE MISS)', async () => {
      cacheManager.get.mockResolvedValue(null);
      const dbRecord = { id: 1, originalUrl: 'http://db.com', shortCode: 'dbcode', isDeleted: false };
      prismaService.url.findUnique.mockResolvedValue(dbRecord);

      const result = await service.getOriginalUrl('dbcode');

      expect(cacheManager.get).toHaveBeenCalledWith('dbcode');
      expect(prismaService.url.findUnique).toHaveBeenCalledWith({ where: { shortCode: 'dbcode' } });
      expect(cacheManager.set).toHaveBeenCalledWith('dbcode', { originalUrl: 'http://db.com', id: 1 });
      expect(result).toEqual({ originalUrl: 'http://db.com', id: 1 });
    });

    it('should throw NotFoundException if not in DB', async () => {
      cacheManager.get.mockResolvedValue(null);
      prismaService.url.findUnique.mockResolvedValue(null);

      await expect(service.getOriginalUrl('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if isDeleted is true', async () => {
      cacheManager.get.mockResolvedValue(null);
      prismaService.url.findUnique.mockResolvedValue({ id: 1, isDeleted: true });

      await expect(service.getOriginalUrl('deleted')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUrl', () => {
    const mockUrl = { id: 1, userId: 10, shortCode: 'update', originalUrl: 'http://old.com', isDeleted: false };
    
    it('should throw NotFoundException if url does not exist', async () => {
      prismaService.url.findUnique.mockResolvedValue(null);
      await expect(service.updateUrl(1, 'http://new.com', 10, Role.USER)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      prismaService.url.findUnique.mockResolvedValue(mockUrl);
      await expect(service.updateUrl(1, 'http://new.com', 99, Role.USER)).rejects.toThrow(ForbiddenException);
    });

    it('should allow ADMIN to update even if not owner', async () => {
      prismaService.url.findUnique.mockResolvedValue(mockUrl);
      prismaService.url.update.mockResolvedValue({ ...mockUrl, originalUrl: 'http://new.com' });
      
      const result = await service.updateUrl(1, 'http://new.com', 99, Role.ADMIN);
      
      expect(prismaService.url.update).toHaveBeenCalled();
      expect(cacheManager.del).toHaveBeenCalledWith('update');
      expect(result.originalUrl).toBe('http://new.com');
    });

    it('should allow owner to update', async () => {
      prismaService.url.findUnique.mockResolvedValue(mockUrl);
      prismaService.url.update.mockResolvedValue({ ...mockUrl, originalUrl: 'http://new.com' });
      
      const result = await service.updateUrl(1, 'http://new.com', 10, Role.USER);
      
      expect(prismaService.url.update).toHaveBeenCalled();
      expect(cacheManager.del).toHaveBeenCalledWith('update');
      expect(result.originalUrl).toBe('http://new.com');
    });
  });
});
