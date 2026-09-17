import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Result } from '../../../core/types/result';
import { ResultStatus } from '../../../core/types/result-code';
import {
  SecurityDevices,
  SecurityDevicesDocument,
  type SecurityDevicesModelType,
} from '../domain/security-devices.entity';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectModel(SecurityDevices.name)
    private securityDevicesModel: SecurityDevicesModelType,
  ) {}

  async createSession(
    newSession: SecurityDevices,
  ): Promise<SecurityDevicesDocument> {
    return this.securityDevicesModel.create(newSession);
  }

  async findSessionByDeviceId(
    deviceId: string,
  ): Promise<SecurityDevicesDocument | null> {
    return this.securityDevicesModel.findOne({ deviceId });
  }

  async deleteSessionByDeviceId(deviceId: string): Promise<Result<null>> {
    const result = await this.securityDevicesModel.deleteOne({ deviceId });

    if (result.deletedCount === 1) {
      return {
        data: null,
        status: ResultStatus.Success,
        errorMessage: '',
        extensions: [],
      };
    }

    return {
      data: null,
      status: ResultStatus.NotFound,
      errorMessage: '',
      extensions: [],
    };
  }

  async deleteAllSessionsExcludeCurrent({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }) {
    await this.securityDevicesModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async save(entity: SecurityDevicesDocument) {
    await entity.save();
  }
}
