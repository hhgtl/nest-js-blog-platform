import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { jwtAdapter } from '../../../../core/adapters/jwt-adapter';
import { JwtRefreshBlackListRepository } from '../../../jwt-refresh-black-list/infrastructure/jwt-refresh-black-list.repository';
import {
  accessTokenExpirationForTest,
  refreshTokenExpirationForTest,
} from '../../constants/auth.constants';
import { LoginType } from './login.usecase';
import { Types } from 'mongoose';

export class RefreshTokenCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<
  RefreshTokenCommand,
  Result<LoginType>
> {
  constructor(
    private userRepository: UserRepository,
    private jwtRefreshBlackListRepository: JwtRefreshBlackListRepository,
  ) {}

  async execute({
    refreshToken,
  }: RefreshTokenCommand): Promise<Result<LoginType>> {
    const payload = jwtAdapter.verifyToken(refreshToken);

    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [],
      };
    }

    const tokenInBlackList =
      await this.jwtRefreshBlackListRepository.findJwtInBlackList(refreshToken);

    if (tokenInBlackList) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [],
      };
    }

    const user = await this.userRepository.findUserById(
      new Types.ObjectId(payload.userId),
    );

    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [],
      };
    }

    await this.jwtRefreshBlackListRepository.addJwtToBlackList(refreshToken);

    const userId = user._id.toString();

    const newAccessToken = jwtAdapter.createToken({
      userId,
      expiresIn: accessTokenExpirationForTest,
    });
    const newRefreshToken = jwtAdapter.createToken({
      userId,
      expiresIn: refreshTokenExpirationForTest,
    });

    return {
      status: ResultStatus.Success,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      extensions: [],
    };
  }
}
