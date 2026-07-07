import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { Inject } from '@nestjs/common';
import { PostQueryRepository } from '../../infrastructure/query/post.query-repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { GetPostsQueryParams } from '../../api/input-dto/post-query-params.input-dto';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { Types } from 'mongoose';
import { CommentsQueryRepository } from '../../../comments/infrastructure/query/comments.query-repository';
import { CommentViewDto } from '../../../comments/api/view-dto/comment.view-dto';

export class GetCommentsByPostIdQuery {
  constructor(
    public postId: string,
    public query: GetPostsQueryParams,
  ) {}
}

@QueryHandler(GetCommentsByPostIdQuery)
export class GetCommentsByPostIdHandler implements IQueryHandler<
  GetCommentsByPostIdQuery,
  Result<PaginatedViewDto<CommentViewDto[]> | null>
> {
  constructor(
    @Inject(PostQueryRepository)
    private readonly queryRepository: PostQueryRepository,
    @Inject(CommentsQueryRepository)
    private readonly commentsRepository: CommentsQueryRepository,
  ) {}

  async execute({
    postId,
    query,
  }: GetCommentsByPostIdQuery): Promise<
    Result<PaginatedViewDto<CommentViewDto[]> | null>
  > {
    // const blog = await this.commentsRepository.findCommentById(blogId);
    const post = await this.queryRepository.getPostById(
      new Types.ObjectId(postId),
    );

    if (post.status !== ResultStatus.Success) {
      return {
        data: null,
        status: post.status,
        errorMessage: '',
        extensions: [],
      };
    }

    const comments = await this.commentsRepository.getAllCommentsByPostId(
      postId,
      query,
    );

    return {
      data: comments,
      status: ResultStatus.Success,
      errorMessage: '',
      extensions: [],
    };
  }
}
