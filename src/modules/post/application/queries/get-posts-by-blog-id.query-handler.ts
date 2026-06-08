import { GetPostsByBlogIdQueryParams } from '../../../blogs/api/input-dto/blogs-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { Inject } from '@nestjs/common';
import { PostQueryRepository } from '../../infrastructure/query/post.query-repository';
import { PostViewDto } from '../../api/view-dto/post.view-dto';

export class GetPostsByBlogIdQuery {
  constructor(
    public blogId: string,
    public query: GetPostsByBlogIdQueryParams,
  ) {}
}

@QueryHandler(GetPostsByBlogIdQuery)
export class GetPostsByBlogIdHandler implements IQueryHandler<
  GetPostsByBlogIdQuery,
  PaginatedViewDto<PostViewDto[]>
> {
  constructor(
    @Inject(PostQueryRepository)
    private readonly queryRepository: PostQueryRepository,
  ) {}

  async execute({
    blogId,
    query,
  }: GetPostsByBlogIdQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.queryRepository.getAllPostsByBlogId(blogId, query);
  }
}
