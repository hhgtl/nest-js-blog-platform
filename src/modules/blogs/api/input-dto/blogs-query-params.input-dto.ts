import { BlogsSortBy } from './blogs-sort-by';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { Transform, TransformFnParams } from 'class-transformer';

export class GetBlogsQueryParams extends BaseQueryParams {
  @IsOptional()
  @Transform((params: TransformFnParams): BlogsSortBy => {
    const value: unknown = params.value;
    if (value === undefined || value === '') return BlogsSortBy.CreatedAt;
    return value as BlogsSortBy;
  })
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;

  @IsOptional()
  @IsString()
  searchNameTerm?: string;
}

export class GetPostsByBlogIdQueryParams extends BaseQueryParams {
  @IsOptional()
  @Transform((params: TransformFnParams): BlogsSortBy => {
    const value: unknown = params.value;
    if (value === undefined || value === '') return BlogsSortBy.CreatedAt;
    return value as BlogsSortBy;
  })
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;
}
