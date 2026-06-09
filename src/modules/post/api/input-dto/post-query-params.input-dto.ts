import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum PostSortBy {
  CreatedAt = 'createdAt',
}

export class GetPostsQueryParams extends BaseQueryParams {
  @IsOptional()
  @IsEnum(PostSortBy)
  sortBy = PostSortBy.CreatedAt;
}
