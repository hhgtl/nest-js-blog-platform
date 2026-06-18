import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { LoginInputDto } from '../../api/input-dto/login.input-dto';
import { AuthService } from '../../services/auth-service';
import { jwtAdapter } from '../../../../core/adapters/jwt-adapter';
import {
  accessTokenExpiration,
  refreshTokenExpiration,
} from '../../constants/auth.constants';

export type LoginType = { refreshToken: string; accessToken: string };

export class LoginCommand {
  constructor(public dto: LoginInputDto) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<
  LoginCommand,
  Result<LoginType>
> {
  constructor(private userRepository: UserRepository) {}

  async execute({ dto }: LoginCommand): Promise<Result<LoginType>> {
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

    const accessToken = jwtAdapter.createToken({
      userId,
      expiresIn: accessTokenExpiration,
    });
    const refreshToken = jwtAdapter.createToken({
      userId,
      expiresIn: refreshTokenExpiration,
    });

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  }
}
