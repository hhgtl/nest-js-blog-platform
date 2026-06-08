import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';

export enum PostSortBy {
  CreatedAt = 'createdAt',
}

export class GetPostsQueryParams extends BaseQueryParams {
  @IsEnum(PostSortBy)
  sortBy = PostSortBy.CreatedAt;
}
