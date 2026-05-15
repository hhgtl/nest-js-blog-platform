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

  async findUserById(id: Types.ObjectId): Promise<Result<BlogsDocument>> {
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

  async save(entity: BlogsDocument) {
    await entity.save();
  }
}
