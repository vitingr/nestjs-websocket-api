import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';
import { urlencoded, json, Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.enableCors({
    origin: 'https://pifa-24.vercel.app/',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(process.env.PORT || 3030);
}
bootstrap();