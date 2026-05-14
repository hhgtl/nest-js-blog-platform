import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  type BlogModelType,
  Blogs,
  BlogsDocument,
} from '../domain/blogs.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blogs.name) private blogModel: BlogModelType) {}

  async findById(id: Types.ObjectId): Promise<BlogsDocument | null> {
    return this.blogModel.findOne({
      _id: id,
    });
  }

  async save(entity: BlogsDocument) {
    await entity.save();
  }
}
