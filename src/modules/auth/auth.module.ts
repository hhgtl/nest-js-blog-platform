import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/usecases/login.usecase';
import { AuthController } from './api/auth.controller';
import { UserModule } from '../user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { GetBlogsQueryHandler } from './application/queries/get-me.query-handler';
import { JwtRefreshBlackListModule } from '../jwt-refresh-black-list/jwt-refresh-black-list.module';
import { RegistrationUseCase } from './application/usecases/registration.usecase';
import { RegistrationConfirmationUseCase } from './application/usecases/registration-confirmation.usecase';
import { RegistrationEmailResendingUseCase } from './application/usecases/registration-email-resending.usecase';
import { RefreshTokenUseCase } from './application/usecases/refresh-token.usecase';
import { LogoutUseCase } from './application/usecases/logout.usecase';

@Module({
  imports: [CqrsModule, UserModule, JwtRefreshBlackListModule],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    GetBlogsQueryHandler,
    RegistrationUseCase,
    RegistrationConfirmationUseCase,
    RegistrationEmailResendingUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
  ],
  exports: [],
})
export class AuthModule {}
