import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  type BlogModelType,
  Blogs,
  BlogsDocument,
} from '../domain/blogs.entity';
import { Result } from '../../../core/types/result';
import { ResultStatus } from '../../../core/types/result-code';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blogs.name) private blogModel: BlogModelType) {}

  async findById(id: Types.ObjectId): Promise<BlogsDocument | null> {
    return this.blogModel.findOne({
      _id: id,
    });
  }

  async findBlogById(id: string): Promise<Result<BlogsDocument>> {
    if (!Types.ObjectId.isValid(id)) {
      return {
        data: null,
        status: ResultStatus.BadRequest,
        errorMessage: 'Id must be a valid ObjectId',
        extensions: [],
      };
    }

    const entity = await this.findById(new Types.ObjectId(id));

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

  async deleteBlogById(_id: Types.ObjectId): Promise<Result<null>> {
    const result = await this.blogModel.deleteOne({
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

  async save(entity: BlogsDocument) {
    await entity.save();
  }
}
