import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type BlogModelType, Blogs } from '../../domain/blogs.entity';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { Types } from 'mongoose';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import { GetBlogsQueryParams } from '../../api/input-dto/blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blogs.name) private blogModel: BlogModelType) {}

  async getAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    // const entities = await this.blogModel.find();
    //
    // return entities.map((e) => BlogViewDto.mapToView(e));

    const filter = {};

    if (query.searchNameTerm) {
      filter['name'] = { $regex: query.searchNameTerm, $options: 'i' };
    }

    const entities = await this.blogModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.blogModel.countDocuments(filter);

    const items = entities.map((e) => BlogViewDto.mapToView(e));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
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
