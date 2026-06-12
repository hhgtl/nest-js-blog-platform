import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { IsOptional, IsString } from 'class-validator';

export enum UserSortBy {
  CreatedAt = 'createdAt',
}

export class GetUserQueryParams extends BaseQueryParams {
  @IsOptional()
  @IsString()
  searchLoginTerm = null;

  @IsOptional()
  @IsString()
  searchEmailTerm = null;

  @IsOptional()
  @IsString()
  sortBy = UserSortBy.CreatedAt;
}
