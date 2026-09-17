import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import { jwtAdapter } from '../../../../core/adapters/jwt-adapter';
import { JwtRefreshBlackListRepository } from '../../../jwt-refresh-black-list/infrastructure/jwt-refresh-black-list.repository';
import { SecurityDevicesRepository } from '../../../security-devices/infrastructure/security-devices.repository';

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
    private securityDevicesRepository: SecurityDevicesRepository,
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

    const session = await this.securityDevicesRepository.findSessionByDeviceId(
      payload.deviceId,
    );

    if (!session || session.iat !== payload.iat) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [],
      };
    }

    await this.jwtRefreshBlackListRepository.addJwtToBlackList(refreshToken);

    await this.securityDevicesRepository.deleteSessionByDeviceId(
      payload.deviceId,
    );

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
