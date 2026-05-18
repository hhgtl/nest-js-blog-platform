import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { Inject } from '@nestjs/common';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';
import { Types } from 'mongoose';
import { Result } from '../../../../core/types/result';

export class GetBlogsByIdQuery {
  constructor(public id: Types.ObjectId) {}
}

@QueryHandler(GetBlogsByIdQuery)
export class GetBlogsByIdQueryHandler implements IQueryHandler<
  GetBlogsByIdQuery,
  Result<BlogViewDto>
> {
  constructor(
    @Inject(BlogsQueryRepository)
    private readonly queryRepository: BlogsQueryRepository,
  ) {}

  async execute({ id }: GetBlogsByIdQuery): Promise<Result<BlogViewDto>> {
    return this.queryRepository.getBlogById(id);
  }
}
