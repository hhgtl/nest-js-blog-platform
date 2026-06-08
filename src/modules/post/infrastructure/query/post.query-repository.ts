import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import { Post, type PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { GetPostsQueryParams } from '../../api/input-dto/post-query-params.input-dto';
import { BlogViewDto } from '../../../blogs/api/view-dto/blog.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class PostQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}

  async getAllPosts(
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter = {};

    const entities = await this.postModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .limit(query.calculateSkip())
      .skip(query.pageSize);

    const totalCount = await this.postModel.countDocuments(filter);

    const items = entities.map((e) => PostViewDto.mapToView(e));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
    // return entities.map((e) => PostViewDto.mapToView(e));
  }

  async getPostById(_id: Types.ObjectId): Promise<Result<PostViewDto>> {
    const entity = await this.postModel.findOne({
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
      data: PostViewDto.mapToView(entity),
      status: ResultStatus.Success,
      errorMessage: '',
      extensions: [],
    };
  }
}
