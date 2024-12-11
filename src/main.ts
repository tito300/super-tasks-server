import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use(json({ limit: '10mb' }));

  const PORT = process.env.PORT || 3444;
  await app.listen(PORT);
}
bootstrap();
