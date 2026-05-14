import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { Inject } from '@nestjs/common';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';

export class GetBlogsQuery {
  constructor() {}
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsQueryHandler implements IQueryHandler<
  GetBlogsQuery,
  BlogViewDto[]
> {
  constructor(
    @Inject(BlogsQueryRepository)
    private readonly queryRepository: BlogsQueryRepository,
  ) {}

  async execute(): Promise<BlogViewDto[]> {
    return this.queryRepository.getAll();
  }
}
