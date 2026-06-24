import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { MeViewDto } from '../../api/view-dto/me.view-dto';
import { Types } from 'mongoose';
import { ResultStatus } from '../../../../core/types/result-code';
import { Result } from '../../../../core/types/result';

export class GetMeQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetMeQuery)
export class GetBlogsQueryHandler implements IQueryHandler<
  GetMeQuery,
  Result<MeViewDto>
> {
  constructor(private userRepository: UserRepository) {}

  async execute({ userId }: GetMeQuery): Promise<Result<MeViewDto>> {
    const user = await this.userRepository.findUserById(
      new Types.ObjectId(userId),
    );

    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [],
      };
    }

    return {
      status: ResultStatus.Success,
      data: {
        login: user.login,
        email: user.email,
        userId: user.id.toString(),
      },
      extensions: [],
    };
  }
}
