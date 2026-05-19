import { Types } from 'mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { PostRepository } from '../../infrastructure/post.repository';

export class DeletePostCommand {
  constructor(public id: Types.ObjectId) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<
  DeletePostCommand,
  Result<null>
> {
  constructor(private postRepository: PostRepository) {}

  async execute({ id }: DeletePostCommand): Promise<Result<null>> {
    return this.postRepository.deletePostById(id);
  }
}
