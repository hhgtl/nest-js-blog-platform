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

  async findOrNotFoundFail(id: Types.ObjectId): Promise<BlogsDocument> {
    const entity = await this.findById(id);

    if (!entity) {
      //TODO: Replace with NotFoundDomainException
      throw new Error('Blogs not found');
    }

    return entity;
  }

  async save(entity: BlogsDocument) {
    await entity.save();
  }
}
