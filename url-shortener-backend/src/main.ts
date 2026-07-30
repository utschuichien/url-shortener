import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Enable CORS for frontend access
  app.enableCors();

  // Global validation pipe — auto-validates DTOs via class-validator 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw if extra properties sent
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  // Global exception filter — clean error responses, no stack trace leaks
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error('Lỗi khởi động server:', err);
});
