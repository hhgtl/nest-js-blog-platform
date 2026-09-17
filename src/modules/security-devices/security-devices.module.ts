import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import {
  SecurityDevices,
  SecurityDevicesSchema,
} from './domain/security-devices.entity';
import { SecurityDevicesController } from './api/security-devices.controller';
import { SecurityDevicesRepository } from './infrastructure/security-devices.repository';
import { SecurityDevicesQueryRepository } from './infrastructure/query/security-devices.query-repository';
import { GetAllSessionsQueryHandler } from './application/queries/get-all-sessions.query-handler';
import { DeleteAllSessionsUseCase } from './application/usecases/delete-all-sessions.usecase';
import { DeleteSessionByDeviceIdUseCase } from './application/usecases/delete-session-by-device-id.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SecurityDevices.name, schema: SecurityDevicesSchema },
    ]),
    CqrsModule,
  ],
  controllers: [SecurityDevicesController],
  providers: [
    SecurityDevicesRepository,
    SecurityDevicesQueryRepository,
    GetAllSessionsQueryHandler,
    DeleteAllSessionsUseCase,
    DeleteSessionByDeviceIdUseCase,
  ],
  exports: [SecurityDevicesRepository],
})
export class SecurityDevicesModule {}
