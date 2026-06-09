import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum PostSortBy {
  CreatedAt = 'createdAt',
}

export class GetPostsQueryParams extends BaseQueryParams {
  @IsOptional()
  @IsString()
  sortBy = PostSortBy.CreatedAt;
}
