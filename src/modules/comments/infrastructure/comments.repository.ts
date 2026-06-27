import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  type PostModelType,
} from '../../post/domain/post.entity';
import { Types } from 'mongoose';
import { Result } from '../../../core/types/result';
import { ResultStatus } from '../../../core/types/result-code';
import {
  Comments,
  CommentsDocument,
  type CommentsModelType,
} from '../domain/comments.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comments.name) private commentModel: CommentsModelType,
  ) {}

  async findById(id: Types.ObjectId): Promise<CommentsDocument | null> {
    return this.commentModel.findOne({
      _id: id,
    });
  }

  async findCommentById(id: Types.ObjectId): Promise<Result<CommentsDocument>> {
    if (!Types.ObjectId.isValid(id)) {
      return {
        data: null,
        status: ResultStatus.BadRequest,
        errorMessage: 'Id must be a valid ObjectId',
        extensions: [],
      };
    }

    const entity = await this.findById(id);

    if (!entity) {
      return {
        data: entity,
        status: ResultStatus.NotFound,
        errorMessage: '',
        extensions: [],
      };
    }

    return {
      data: entity,
      status: ResultStatus.Success,
      errorMessage: '',
      extensions: [],
    };
  }

  async deletePostById(_id: Types.ObjectId): Promise<Result<null>> {
    const result = await this.commentModel.deleteOne({
      _id,
    });

    if (result.deletedCount === 1) {
      return {
        data: null,
        status: ResultStatus.Success,
        errorMessage: '',
        extensions: [],
      };
    }

    return {
      data: null,
      status: ResultStatus.NotFound,
      errorMessage: '',
      extensions: [],
    };
  }

  async save(entity: PostDocument) {
    await entity.save();
  }
}
