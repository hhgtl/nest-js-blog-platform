import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostQueryRepository } from '../../infrastructure/query/post.query-repository';
import { GetPostsQueryParams } from '../../api/input-dto/post-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

export class GetPostsQuery {
  constructor(public query: GetPostsQueryParams) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler<
  GetPostsQuery,
  PaginatedViewDto<PostViewDto[]>
> {
  constructor(
    @Inject(PostQueryRepository)
    private readonly queryRepository: PostQueryRepository,
  ) {}

  async execute(
    params: GetPostsQuery,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.queryRepository.getAllPosts(params.query);
  }
}
