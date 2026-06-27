import { Types } from 'mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { Inject } from '@nestjs/common';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query-repository';

export class GetCommentByIdQuery {
  constructor(public id: Types.ObjectId) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler implements IQueryHandler<
  GetCommentByIdQuery,
  Result<CommentViewDto>
> {
  constructor(
    @Inject(CommentsQueryRepository)
    private readonly queryRepository: CommentsQueryRepository,
  ) {}

  async execute({ id }: GetCommentByIdQuery): Promise<Result<CommentViewDto>> {
    return this.queryRepository.getCommentById(id);
  }
}
