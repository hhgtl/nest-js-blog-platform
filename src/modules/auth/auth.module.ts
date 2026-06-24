import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/usecases/login.usecase';
import { AuthController } from './api/auth.controller';
import { UserModule } from '../user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { GetBlogsQueryHandler } from './application/queries/get-me.query-handler';

@Module({
  imports: [CqrsModule, UserModule],
  controllers: [AuthController],
  providers: [LoginUseCase, GetBlogsQueryHandler],
  exports: [],
})
export class AuthModule {}
