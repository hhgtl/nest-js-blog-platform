import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import { UpdateCommentsInputDto } from '../../api/input-dto/update-comments.input.dto';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { Types } from 'mongoose';

export class UpdateCommentCommand {
  constructor(
    public id: string,
    public dto: UpdateCommentsInputDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<
  UpdateCommentCommand,
  Result<null>
> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ id, dto }: UpdateCommentCommand): Promise<Result<null>> {
    const entity = await this.commentsRepository.findCommentById(
      new Types.ObjectId(id),
    );

    if (entity.status === ResultStatus.NotFound) {
      return {
        data: null,
        status: ResultStatus.NotFound,
        errorMessage: '',
        extensions: [],
      };
    }

    if (entity.status === ResultStatus.Success) {
      const commentEntity = entity.data;

      Object.assign(commentEntity, dto);
      await this.commentsRepository.save(commentEntity);

      return {
        data: null,
        status: ResultStatus.Success,
        errorMessage: '',
        extensions: [],
      };
    }

    return {
      data: null,
      status: ResultStatus.InternalError,
      errorMessage: '',
      extensions: [],
    };
  }
}
