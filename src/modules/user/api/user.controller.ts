import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQueryParams } from './view-dto/get-post-query-params.view-dto';
import { GetUsersQuery } from '../application/queries/get-users.query-handler';
import { BaseAuthorizationGuard } from '../../../core/guards/base-authorization.guard';
import { CreatUserCommand } from '../application/usecases/create-user.usecase';
import { CreateUserDto } from '../dto/user.dto';
import { Result } from '../../../core/types/result';
import { UserViewDto } from './view-dto/user.view-dto';
import { ResultStatus } from '../../../core/types/result-code';
import { CreateUserInputDto } from './input-dto/create-user.input-dto';
import { DeleteUserCommand } from '../application/usecases/delete-user-by-id.usecase';
import { Types } from 'mongoose';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(BaseAuthorizationGuard)
  @Get()
  getAllUsers(@Query() query: GetUserQueryParams) {
    return this.queryBus.execute(new GetUsersQuery(query));
  }

  @UseGuards(BaseAuthorizationGuard)
  @Post()
  async createUser(@Body() dto: CreateUserInputDto) {
    const result = await this.commandBus.execute<
      CreatUserCommand,
      Result<UserViewDto>
    >(new CreatUserCommand(dto));

    if (result.status === ResultStatus.BadRequest) {
      throw new BadRequestException(result.extensions);
    }

    if (result.status === ResultStatus.Success) {
      return result.data;
    }

    throw new InternalServerErrorException();
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const result = await this.commandBus.execute<
      DeleteUserCommand,
      Result<UserViewDto>
    >(new DeleteUserCommand(new Types.ObjectId(id)));

    if (result.status === ResultStatus.BadRequest) {
      throw new BadRequestException(result.extensions);
    }

    if (result.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }
}
