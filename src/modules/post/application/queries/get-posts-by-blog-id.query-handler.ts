import { GetPostsByBlogIdQueryParams } from '../../../blogs/api/input-dto/blogs-query-params.input-dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { Inject } from '@nestjs/common';
import { PostQueryRepository } from '../../infrastructure/query/post.query-repository';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { ResultStatus } from '../../../../core/types/result-code';
import { Result } from '../../../../core/types/result';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';

export class GetPostsByBlogIdQuery {
  constructor(
    public blogId: string,
    public query: GetPostsByBlogIdQueryParams,
  ) {}
}

@QueryHandler(GetPostsByBlogIdQuery)
export class GetPostsByBlogIdHandler implements IQueryHandler<
  GetPostsByBlogIdQuery,
  Result<PaginatedViewDto<PostViewDto[]> | null>
> {
  constructor(
    @Inject(PostQueryRepository)
    private readonly queryRepository: PostQueryRepository,
    @Inject(BlogsRepository)
    private readonly blogRepository: BlogsRepository,
  ) {}

  async execute({
    blogId,
    query,
  }: GetPostsByBlogIdQuery): Promise<
    Result<PaginatedViewDto<PostViewDto[]> | null>
  > {
    const blog = await this.blogRepository.findBlogById(blogId);

    if (blog.status !== ResultStatus.Success) {
      return {
        data: null,
        status: blog.status,
        errorMessage: '',
        extensions: [],
      };
    }

    const posts = await this.queryRepository.getAllPostsByBlogId(blogId, query);

    return {
      data: posts,
      status: ResultStatus.Success,
      errorMessage: '',
      extensions: [],
    };
  }
}
