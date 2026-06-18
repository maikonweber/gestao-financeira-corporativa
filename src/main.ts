import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { getCorsConfig } from './config/cors.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.enableCors(getCorsConfig(configService));
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  setupSwagger(app);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(
    {
      event: 'app.bootstrap.success',
      port,
      environment: configService.get<string>('NODE_ENV', 'development'),
      swagger: `http://localhost:${port}/api/docs`,
      apiPrefix: '/api/v1',
    },
    'Application started',
  );
}

bootstrap();
