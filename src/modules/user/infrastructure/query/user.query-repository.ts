import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserModelType } from '../../domain/user.entity';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UserViewDto } from '../../api/view-dto/user.view-dto';
import { GetUserQueryParams } from '../../api/view-dto/get-post-query-params.view-dto';

@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async getAllUsers(
    query: GetUserQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const filter = {};

    if (query.searchEmailTerm) {
      filter['email'] = { $regex: query.searchEmailTerm, $options: 'i' };
    }

    if (query.searchLoginTerm) {
      filter['login'] = { $regex: query.searchLoginTerm, $options: 'i' };
    }

    const entities = await this.userModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .limit(query.pageSize)
      .skip(query.calculateSkip());

    const totalCount = await this.userModel.countDocuments(filter);

    const items = entities.map((e) => UserViewDto.mapToView(e));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
