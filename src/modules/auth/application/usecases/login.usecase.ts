import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { LoginInputDto } from '../../api/input-dto/login.input-dto';
import { AuthService } from '../../services/auth-service';
import { jwtAdapter } from '../../../../core/adapters/jwt-adapter';
import {
  accessTokenExpirationForTest,
  refreshTokenExpirationForTest,
} from '../../constants/auth.constants';
import { SecurityDevicesRepository } from '../../../security-devices/infrastructure/security-devices.repository';
import { randomUUID } from 'crypto';

export type LoginType = { refreshToken: string; accessToken: string };

export class LoginCommand {
  constructor(
    public dto: LoginInputDto,
    public ip: string,
    public userAgent: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<
  LoginCommand,
  Result<LoginType>
> {
  constructor(
    private userRepository: UserRepository,
    private securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute({
    dto,
    ip,
    userAgent,
  }: LoginCommand): Promise<Result<LoginType>> {
    const { loginOrEmail, password } = dto;

    const authService = new AuthService(this.userRepository);

    const checkUserCredentialsResult = await authService.checkUserCredentials({
      loginOrEmail,
      password,
    });

    if (checkUserCredentialsResult.status !== ResultStatus.Success) {
      return {
        status: checkUserCredentialsResult.status,
        extensions: checkUserCredentialsResult.extensions,
        data: null,
      };
    }

    const userId = checkUserCredentialsResult.data?._id.toString()!;
    const deviceId = randomUUID();

    const accessToken = jwtAdapter.createToken({
      userId,
      deviceId,
      expiresIn: accessTokenExpirationForTest,
    });
    const refreshToken = jwtAdapter.createToken({
      userId,
      deviceId,
      expiresIn: refreshTokenExpirationForTest,
    });

    const { iat, exp } = jwtAdapter.decodeToken(refreshToken);

    await this.securityDevicesRepository.createSession({
      userId,
      deviceId,
      ip,
      title: userAgent,
      lastActiveDate: new Date().toISOString(),
      iat,
      exp,
    });

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  }
}
