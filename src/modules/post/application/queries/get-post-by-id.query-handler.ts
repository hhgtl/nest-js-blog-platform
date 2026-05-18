import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Types } from 'mongoose';
import { Result } from '../../../../core/types/result';
import { PostQueryRepository } from '../../infrastructure/query/post.query-repository';
import { PostViewDto } from '../../api/view-dto/post.view-dto';

export class GetPostByIdQuery {
  constructor(public id: Types.ObjectId) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler implements IQueryHandler<
  GetPostByIdQuery,
  Result<PostViewDto>
> {
  constructor(
    @Inject(PostQueryRepository)
    private readonly queryRepository: PostQueryRepository,
  ) {}

  async execute({ id }: GetPostByIdQuery): Promise<Result<PostViewDto>> {
    return this.queryRepository.getPostById(id);
  }
}
