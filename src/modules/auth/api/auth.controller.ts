import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
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
import { JwtAuthGuard } from '../../../core/guards/jwt-authorization.guard';
import { GetMeQuery } from '../application/queries/get-me.query-handler';
import { MeViewDto } from './view-dto/me.view-dto';

type RequestWithUser = Request & {
  user?: { userId: string };
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: RequestWithUser): Promise<MeViewDto> {
    const result = await this.queryBus.execute<GetMeQuery, Result<MeViewDto>>(
      new GetMeQuery(req.user!.userId),
    );

    if (result.status === ResultStatus.BadRequest) {
      throw new BadRequestException(result.extensions);
    }

    if (result.status === ResultStatus.Unauthorized) {
      throw new UnauthorizedException(result.extensions);
    }

    if (result.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (result.status === ResultStatus.Success) {
      return result.data;
    }

    throw new InternalServerErrorException();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.commandBus.execute<
      LoginCommand,
      Result<LoginType>
    >(new LoginCommand(dto));

    if (result.status === ResultStatus.BadRequest) {
      throw new BadRequestException(result.extensions);
    }

    if (result.status === ResultStatus.Unauthorized) {
      throw new UnauthorizedException(result.extensions);
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
