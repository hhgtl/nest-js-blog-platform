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
import { type Request, type Response } from 'express';
import { JwtAuthGuard } from '../../../core/guards/jwt-authorization.guard';
import { GetMeQuery } from '../application/queries/get-me.query-handler';
import { MeViewDto } from './view-dto/me.view-dto';
import { RegistrationInputDto } from './input-dto/registration.input-dto';
import { RegistrationCommand } from '../application/usecases/registration.usecase';
import { RegistrationConfirmationInputDto } from './input-dto/registration-confirmation.input-dto';
import { RegistrationConfirmationCommand } from '../application/usecases/registration-confirmation.usecase';
import { RegistrationEmailResendingInputDto } from './input-dto/registration-email-resending.input-dto';
import { RegistrationEmailResendingCommand } from '../application/usecases/registration-email-resending.usecase';
import { RefreshTokenCommand } from '../application/usecases/refresh-token.usecase';
import { LogoutCommand } from '../application/usecases/logout.usecase';

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

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: RegistrationInputDto) {
    const result = await this.commandBus.execute<
      RegistrationCommand,
      Result<null>
    >(new RegistrationCommand(dto));

    if (result.status === ResultStatus.BadRequest) {
      throw new BadRequestException({ errorsMessages: result.extensions });
    }

    if (result.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() dto: RegistrationConfirmationInputDto,
  ) {
    const result = await this.commandBus.execute<
      RegistrationConfirmationCommand,
      Result<null>
    >(new RegistrationConfirmationCommand(dto));

    if (result.status === ResultStatus.BadRequest) {
      throw new BadRequestException({ errorsMessages: result.extensions });
    }

    if (result.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() dto: RegistrationEmailResendingInputDto,
  ) {
    const result = await this.commandBus.execute<
      RegistrationEmailResendingCommand,
      Result<null>
    >(new RegistrationEmailResendingCommand(dto));

    if (result.status === ResultStatus.BadRequest) {
      throw new BadRequestException({ errorsMessages: result.extensions });
    }

    if (result.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[REFRESH_TOKEN] as string;

    const result = await this.commandBus.execute<
      RefreshTokenCommand,
      Result<LoginType>
    >(new RefreshTokenCommand(refreshToken));

    if (result.status === ResultStatus.Unauthorized) {
      throw new UnauthorizedException();
    }

    if (result.status === ResultStatus.Success) {
      res.cookie(REFRESH_TOKEN, result.data.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: COOKIE_MAX_AGE_20_SECONDS,
        sameSite: 'none',
        path: '/',
      });
      return { accessToken: result.data.accessToken };
    }

    throw new InternalServerErrorException();
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN] as string;

    const result = await this.commandBus.execute<LogoutCommand, Result<null>>(
      new LogoutCommand(refreshToken),
    );

    if (result.status === ResultStatus.Unauthorized) {
      throw new UnauthorizedException();
    }

    if (result.status === ResultStatus.Success) {
      res.clearCookie(REFRESH_TOKEN, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });
      return;
    }

    throw new InternalServerErrorException();
  }
}
