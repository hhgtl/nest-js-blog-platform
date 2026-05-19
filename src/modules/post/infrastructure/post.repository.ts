import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Result } from '../../../core/types/result';
import { ResultStatus } from '../../../core/types/result-code';
import { Post, PostDocument, type PostModelType } from '../domain/post.entity';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}

  async findById(id: Types.ObjectId): Promise<PostDocument | null> {
    return this.postModel.findOne({
      _id: id,
    });
  }

  async findPostById(id: Types.ObjectId): Promise<Result<PostDocument>> {
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
    const result = await this.postModel.deleteOne({
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
