import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust reverse proxy headers (Railway / Render / Vercel)
  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter?.getInstance?.();
  if (instance?.set) {
    instance.set('trust proxy', 1);
  }

  // Security
  app.use(helmet());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, message: 'Too many requests' }));

  const extraOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // CORS
  app.enableCors({
    origin: [
      process.env.WEB_URL || 'http://localhost:3000',
      'http://localhost:5173',
      'https://pure-krishi-app.vercel.app',
      /\.vercel\.app$/,
      /\.up\.railway\.app$/,
      /\.onrender\.com$/,
      ...extraOrigins,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Pure Krishi Backend running on http://localhost:${port}/api/v1`);
  console.log(`✅ Health check: http://localhost:${port}/api/v1/health`);
}
bootstrap();
