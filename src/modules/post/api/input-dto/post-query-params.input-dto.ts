import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export enum PostSortBy {
  CreatedAt = 'createdAt',
}

export class GetPostsQueryParams extends BaseQueryParams {
  @IsOptional()
  @Transform((params: TransformFnParams): PostSortBy => {
    const value: unknown = params.value;
    if (value === undefined || value === '') return PostSortBy.CreatedAt;
    return value as PostSortBy;
  })
  @IsEnum(PostSortBy)
  sortBy = PostSortBy.CreatedAt;
}
