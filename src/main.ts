import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './apps/api/common/filters/http-exception';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'public'));

  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js web
      'http://localhost:8081', // Expo web (nếu có)
    ],
    credentials: true, // nếu dùng cookie JWT
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Curves API')
    .setDescription('Curves website REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 1234;

  await app.listen(port, '0.0.0.0');
}
bootstrap();
