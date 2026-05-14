import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type BlogModelType, Blogs } from '../../domain/blogs.entity';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blogs.name) private blogModel: BlogModelType) {}

  async getAll(): Promise<BlogViewDto[]> {
    const entities = await this.blogModel.find();

    return entities.map((e) => BlogViewDto.mapToView(e));
  }
}
