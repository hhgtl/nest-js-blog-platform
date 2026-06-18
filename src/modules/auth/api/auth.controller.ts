import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginInputDto } from './input-dto/login.input-dto';
import { LoginCommand, LoginType } from '../application/usecases/login.usecase';
import { ResultStatus } from '../../../core/types/result-code';
import { Result } from '../../../core/types/result';
import {
  COOKIE_MAX_AGE_20_SECONDS,
  REFRESH_TOKEN,
} from '../constants/auth.constants';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  async login(
    @Body() dto: LoginInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.commandBus.execute<
      LoginCommand,
      Result<LoginType>
    >(new LoginCommand(dto));
    console.log(result);
    if (result.status === ResultStatus.BadRequest) {
      throw new BadRequestException(result.extensions);
    }

    if (result.status === ResultStatus.NotFound) {
      throw new NotFoundException(result.extensions);
    }

    if (result.status === ResultStatus.Success) {
      res.cookie(REFRESH_TOKEN, result.data?.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: COOKIE_MAX_AGE_20_SECONDS,
        sameSite: 'none',
        path: '/',
      });
      return { accessToken: result.data?.accessToken };
    }

    throw new InternalServerErrorException();
  }
}
