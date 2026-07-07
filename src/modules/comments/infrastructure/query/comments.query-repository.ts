import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import {
  Comments,
  CommentsDocument,
  type CommentsModelType,
} from '../../domain/comments.entity';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetPostsQueryParams } from '../../../post/api/input-dto/post-query-params.input-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comments.name) private commentModel: CommentsModelType,
  ) {}

  async getCommentById(_id: Types.ObjectId): Promise<Result<CommentViewDto>> {
    const entity = await this.commentModel.findOne({
      _id,
    });

    if (!entity) {
      return {
        data: null,
        status: ResultStatus.NotFound,
        errorMessage: '',
        extensions: [],
      };
    }

    return {
      data: CommentViewDto.mapToView(entity),
      status: ResultStatus.Success,
      errorMessage: '',
      extensions: [],
    };
  }

  async getAllCommentsByPostId(
    postId: string,
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const filter = { postId };

    const entities = await this.commentModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .limit(query.pageSize)
      .skip(query.calculateSkip());

    const totalCount = await this.commentModel.countDocuments(filter);

    const items = entities.map((e) => CommentViewDto.mapToView(e));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
