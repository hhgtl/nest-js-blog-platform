import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { type Request } from 'express';
import { Result } from '../../../core/types/result';
import { ResultStatus } from '../../../core/types/result-code';
import { REFRESH_TOKEN } from '../../auth/constants/auth.constants';
import { SecurityDeviceViewDto } from './view-dto/security-device.view-dto';
import { GetAllSessionsQuery } from '../application/queries/get-all-sessions.query-handler';
import { DeleteAllSessionsCommand } from '../application/usecases/delete-all-sessions.usecase';
import { DeleteSessionByDeviceIdCommand } from '../application/usecases/delete-session-by-device-id.usecase';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAllSessions(@Req() req: Request): Promise<SecurityDeviceViewDto[]> {
    const refreshToken = req.cookies[REFRESH_TOKEN] as string;

    const result = await this.queryBus.execute<
      GetAllSessionsQuery,
      Result<SecurityDeviceViewDto[]>
    >(new GetAllSessionsQuery(refreshToken));

    if (result.status === ResultStatus.Unauthorized) {
      throw new UnauthorizedException();
    }

    if (result.status === ResultStatus.Success) {
      return result.data;
    }

    throw new InternalServerErrorException();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSessions(@Req() req: Request) {
    const refreshToken = req.cookies[REFRESH_TOKEN] as string;

    const result = await this.commandBus.execute<
      DeleteAllSessionsCommand,
      Result<null>
    >(new DeleteAllSessionsCommand(refreshToken));

    if (result.status === ResultStatus.Unauthorized) {
      throw new UnauthorizedException();
    }

    if (result.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }

  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSessionByDeviceId(
    @Param('deviceId') deviceId: string,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies[REFRESH_TOKEN] as string;

    const result = await this.commandBus.execute<
      DeleteSessionByDeviceIdCommand,
      Result<null>
    >(new DeleteSessionByDeviceIdCommand(refreshToken, deviceId));

    if (result.status === ResultStatus.Unauthorized) {
      throw new UnauthorizedException();
    }

    if (result.status === ResultStatus.Forbidden) {
      throw new ForbiddenException();
    }

    if (result.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (result.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }
}
