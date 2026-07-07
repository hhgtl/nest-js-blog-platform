import { Types } from 'mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { ResultStatus } from '../../../../core/types/result-code';

export class DeleteCommentsCommand {
  constructor(
    public id: Types.ObjectId,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteCommentsCommand)
export class DeleteCommentsUseCase implements ICommandHandler<
  DeleteCommentsCommand,
  Result<null>
> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ id, userId }: DeleteCommentsCommand): Promise<Result<null>> {
    const comment = await this.commentsRepository.findCommentById(id);

    if (comment.status !== ResultStatus.Success) {
      return comment;
    }

    if (comment.data.commentatorInfo.userId.toString() !== userId) {
      return {
        data: null,
        status: ResultStatus.Forbidden,
        errorMessage: '',
        extensions: [],
      };
    }

    return this.commentsRepository.deleteCommentById(id);
  }
}
