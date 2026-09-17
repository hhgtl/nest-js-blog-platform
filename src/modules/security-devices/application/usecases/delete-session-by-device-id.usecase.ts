import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import { jwtAdapter } from '../../../../core/adapters/jwt-adapter';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';

export class DeleteSessionByDeviceIdCommand {
  constructor(
    public refreshToken: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteSessionByDeviceIdCommand)
export class DeleteSessionByDeviceIdUseCase implements ICommandHandler<
  DeleteSessionByDeviceIdCommand,
  Result<null>
> {
  constructor(private securityDevicesRepository: SecurityDevicesRepository) {}

  async execute({
    refreshToken,
    deviceId,
  }: DeleteSessionByDeviceIdCommand): Promise<Result<null>> {
    const payload = jwtAdapter.verifyToken(refreshToken);

    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [],
      };
    }

    const currentSession =
      await this.securityDevicesRepository.findSessionByDeviceId(
        payload.deviceId,
      );

    if (!currentSession || currentSession.iat !== payload.iat) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        extensions: [],
      };
    }

    const session =
      await this.securityDevicesRepository.findSessionByDeviceId(deviceId);

    if (!session) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [],
      };
    }

    if (session.userId !== payload.userId) {
      return {
        status: ResultStatus.Forbidden,
        data: null,
        extensions: [],
      };
    }

    return this.securityDevicesRepository.deleteSessionByDeviceId(deviceId);
  }
}
