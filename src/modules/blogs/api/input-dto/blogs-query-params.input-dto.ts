import { BlogsSortBy } from './blogs-sort-by';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

export class GetBlogsQueryParams extends BaseQueryParams {
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;

  @IsOptional()
  @IsString()
  searchNameTerm?: string;
}

export class GetPostsByBlogIdQueryParams extends BaseQueryParams {
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;
}
