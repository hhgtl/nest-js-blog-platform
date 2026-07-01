import { Types } from 'mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';

export class DeleteCommentsCommand {
  constructor(public id: Types.ObjectId) {}
}

@CommandHandler(DeleteCommentsCommand)
export class DeleteCommentsUseCase implements ICommandHandler<
  DeleteCommentsCommand,
  Result<null>
> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ id }: DeleteCommentsCommand): Promise<Result<null>> {
    return this.commentsRepository.deleteCommentById(id);
  }
}
