import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import { jwtAdapter } from '../../../../core/adapters/jwt-adapter';
import { JwtRefreshBlackListRepository } from '../../../jwt-refresh-black-list/infrastructure/jwt-refresh-black-list.repository';

export class LogoutCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<
  LogoutCommand,
  Result<null>
> {
  constructor(
    private jwtRefreshBlackListRepository: JwtRefreshBlackListRepository,
  ) {}

  async execute({ refreshToken }: LogoutCommand): Promise<Result<null>> {
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

    await this.jwtRefreshBlackListRepository.addJwtToBlackList(refreshToken);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
