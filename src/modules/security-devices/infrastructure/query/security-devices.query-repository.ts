import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevices,
  type SecurityDevicesModelType,
} from '../../domain/security-devices.entity';
import { SecurityDeviceViewDto } from '../../api/view-dto/security-device.view-dto';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectModel(SecurityDevices.name)
    private securityDevicesModel: SecurityDevicesModelType,
  ) {}

  async getAllSessionsByUserId(
    userId: string,
  ): Promise<SecurityDeviceViewDto[]> {
    const entities = await this.securityDevicesModel.find({ userId });

    return entities.map((e) => SecurityDeviceViewDto.mapToView(e));
  }
}
