import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import { jwtAdapter } from '../../../../core/adapters/jwt-adapter';
import { SecurityDeviceViewDto } from '../../api/view-dto/security-device.view-dto';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';
import { SecurityDevicesQueryRepository } from '../../infrastructure/query/security-devices.query-repository';

export class GetAllSessionsQuery {
  constructor(public refreshToken: string) {}
}

@QueryHandler(GetAllSessionsQuery)
export class GetAllSessionsQueryHandler implements IQueryHandler<
  GetAllSessionsQuery,
  Result<SecurityDeviceViewDto[]>
> {
  constructor(
    private securityDevicesRepository: SecurityDevicesRepository,
    private securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async execute({
    refreshToken,
  }: GetAllSessionsQuery): Promise<Result<SecurityDeviceViewDto[]>> {
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

    const sessions =
      await this.securityDevicesQueryRepository.getAllSessionsByUserId(
        payload.userId,
      );

    return {
      status: ResultStatus.Success,
      data: sessions,
      extensions: [],
    };
  }
}
