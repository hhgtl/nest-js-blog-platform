import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import { Comments, type CommentsModelType } from '../../domain/comments.entity';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';

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
}
