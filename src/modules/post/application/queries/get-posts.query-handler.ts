import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostQueryRepository } from '../../infrastructure/query/post.query-repository';

export class GetPostsQuery {
  constructor() {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler<
  GetPostsQuery,
  PostViewDto[]
> {
  constructor(
    @Inject(PostQueryRepository)
    private readonly queryRepository: PostQueryRepository,
  ) {}

  async execute(): Promise<PostViewDto[]> {
    return this.queryRepository.getAllPosts();
  }
}
