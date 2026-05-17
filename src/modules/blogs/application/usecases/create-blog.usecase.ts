import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { type BlogModelType, Blogs } from '../../domain/blogs.entity';
import { CreateBlogDto } from '../../dto/blogs.dto';
import { ResultStatus } from '../../../../core/types/result-code';
import { Result } from '../../../../core/types/result';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<
  CreateBlogCommand,
  Result<BlogViewDto>
> {
  constructor(
    @InjectModel(Blogs.name)
    private blogsModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreateBlogCommand): Promise<Result<BlogViewDto>> {
    const entity = await this.blogsModel.create(dto);

    await this.blogsRepository.save(entity);

    const blog = await this.blogsRepository.findBlogById(entity._id);

    if (blog.status === ResultStatus.NotFound) {
      return {
        data: null,
        status: ResultStatus.NotFound,
        errorMessage: '',
        extensions: [],
      };
    }

    if (blog.status === ResultStatus.Success) {
      return {
        data: BlogViewDto.mapToView(blog.data),
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
