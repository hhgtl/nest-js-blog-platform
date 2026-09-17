import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import { jwtAdapter } from '../../../../core/adapters/jwt-adapter';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';

export class DeleteAllSessionsCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(DeleteAllSessionsCommand)
export class DeleteAllSessionsUseCase implements ICommandHandler<
  DeleteAllSessionsCommand,
  Result<null>
> {
  constructor(private securityDevicesRepository: SecurityDevicesRepository) {}

  async execute({
    refreshToken,
  }: DeleteAllSessionsCommand): Promise<Result<null>> {
    const payload = jwtAdapter.verifyToken(refreshToken);

    if (!payload) {
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

    await this.securityDevicesRepository.deleteAllSessionsExcludeCurrent({
      userId: payload.userId,
      deviceId: payload.deviceId,
    });

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
