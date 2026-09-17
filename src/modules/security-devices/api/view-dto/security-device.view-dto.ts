import { SecurityDevicesDocument } from '../../domain/security-devices.entity';

export class SecurityDeviceViewDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  static mapToView(Session: SecurityDevicesDocument): SecurityDeviceViewDto {
    const dto = new SecurityDeviceViewDto();
    dto.ip = Session.ip;
    dto.title = Session.title;
    dto.lastActiveDate = Session.lastActiveDate;
    dto.deviceId = Session.deviceId;

    return dto;
  }
}
