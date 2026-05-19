import { Types } from 'mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResultStatus } from '../../../../core/types/result-code';
import { Result } from '../../../../core/types/result';
import { PostRepository } from '../../infrastructure/post.repository';
import { UpdatePostInputDto } from '../../api/input-dto/update-post.input-dto';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';

export class UpdatePostCommand {
  constructor(
    public id: Types.ObjectId,
    public dto: UpdatePostInputDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<
  UpdatePostCommand,
  Result<null>
> {
  constructor(
    private postRepository: PostRepository,
    private blogRepository: BlogsRepository,
  ) {}

  async execute({ id, dto }: UpdatePostCommand): Promise<Result<null>> {
    const entity = await this.postRepository.findPostById(id);

    if (entity.status !== ResultStatus.Success) {
      return {
        data: null,
        status: entity.status,
        errorMessage: '',
        extensions: [],
      };
    }

    if (dto.blogId) {
      const blogEntity = await this.blogRepository.findBlogById(dto.blogId);

      if (blogEntity.status !== ResultStatus.Success) {
        return {
          data: null,
          status: blogEntity.status,
          errorMessage: '',
          extensions: [],
        };
      }
    }

    const postEntity = entity.data;

    Object.assign(postEntity, dto);
    await this.postRepository.save(postEntity);

    return {
      data: null,
      status: ResultStatus.Success,
      errorMessage: '',
      extensions: [],
    };
  }
}
