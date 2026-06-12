import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { Inject } from '@nestjs/common';
import { GetUserQueryParams } from '../../api/view-dto/get-post-query-params.view-dto';
import { UserQueryRepository } from '../../infrastructure/query/user.query-repository';
import { UserViewDto } from '../../api/view-dto/user.view-dto';

export class GetUsersQuery {
  constructor(public query: GetUserQueryParams) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<
  GetUsersQuery,
  PaginatedViewDto<UserViewDto[]>
> {
  constructor(
    @Inject(UserQueryRepository)
    private readonly queryRepository: UserQueryRepository,
  ) {}

  async execute(
    params: GetUsersQuery,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.queryRepository.getAllUsers(params.query);
  }
}
