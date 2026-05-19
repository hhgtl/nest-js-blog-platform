import { Types } from 'mongoose';
import { UpdateBlogInputDto } from '../../api/input-dto/update-blog.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { Result } from '../../../../core/types/result';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public dto: UpdateBlogInputDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<
  UpdateBlogCommand,
  Result<null>
> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ id, dto }: UpdateBlogCommand): Promise<Result<null>> {
    const entity = await this.blogsRepository.findBlogById(id);

    if (entity.status === ResultStatus.NotFound) {
      return {
        data: null,
        status: ResultStatus.NotFound,
        errorMessage: '',
        extensions: [],
      };
    }

    if (entity.status === ResultStatus.Success) {
      const blogEntity = entity.data;

      Object.assign(blogEntity, dto);
      await this.blogsRepository.save(blogEntity);

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
