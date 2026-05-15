import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupValidationPipe } from './core/pipes/setup-validation-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupValidationPipe(app);

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
