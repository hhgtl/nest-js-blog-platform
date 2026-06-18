import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/usecases/login.usecase';
import { AuthController } from './api/auth.controller';
import { UserModule } from '../user/user.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, UserModule],
  controllers: [AuthController],
  providers: [LoginUseCase],
  exports: [],
})
export class AuthModule {}
