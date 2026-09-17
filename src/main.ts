import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupValidationPipe } from './core/pipes/setup-validation-pipe';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', true);

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  setupValidationPipe(app);

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
