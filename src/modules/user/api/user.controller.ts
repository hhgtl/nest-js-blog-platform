import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQueryParams } from './view-dto/get-post-query-params.view-dto';
import { GetUsersQuery } from '../application/queries/get-users.query-handler';
import { BaseAuthorizationGuard } from '../../../core/guards/base-authorization.guard';

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

  @Post()
  createUser() {}

  @Delete()
  deleteUser() {}
}
