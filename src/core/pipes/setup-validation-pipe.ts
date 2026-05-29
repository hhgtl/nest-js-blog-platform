import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export function setupValidationPipe(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      stopAtFirstError: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const errorsMessages = errors.flatMap((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : [];

          return constraints.slice(0, 1).map((message) => ({
            message,
            field: error.property,
          }));
        });

        return new BadRequestException({ errorsMessages });
      },
    }),
  );
}
