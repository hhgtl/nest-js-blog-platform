import { Types } from 'mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { UserRepository } from '../../infrastructure/user.repository';
import { ResultStatus } from '../../../../core/types/result-code';

export class DeleteUserCommand {
  constructor(public id: Types.ObjectId) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<
  DeleteUserCommand,
  Result<null>
> {
  constructor(private userRepository: UserRepository) {}

  async execute({ id }: DeleteUserCommand): Promise<Result<null>> {
    return await this.userRepository.deleteUserById(id);
  }
}
