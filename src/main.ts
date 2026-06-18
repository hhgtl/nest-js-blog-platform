import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupValidationPipe } from './core/pipes/setup-validation-pipe';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  setupValidationPipe(app);

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
