import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type BlogModelType, Blogs } from '../../domain/blogs.entity';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { Types } from 'mongoose';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blogs.name) private blogModel: BlogModelType) {}

  async getAll(): Promise<BlogViewDto[]> {
    const entities = await this.blogModel.find();

    return entities.map((e) => BlogViewDto.mapToView(e));
  }

  async getBlogById(_id: Types.ObjectId): Promise<Result<BlogViewDto>> {
    const entity = await this.blogModel.findOne({
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
      data: BlogViewDto.mapToView(entity),
      status: ResultStatus.Success,
      errorMessage: '',
      extensions: [],
    };
  }
}
