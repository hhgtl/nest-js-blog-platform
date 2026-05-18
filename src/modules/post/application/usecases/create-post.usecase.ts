import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { ResultStatus } from '../../../../core/types/result-code';
import { Result } from '../../../../core/types/result';
import { Post, type PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostRepository } from '../../infrastructure/post.repository';
import { CreatePostDto } from '../../dto/post.dto';

export class CreatPostCommand {
  constructor(public dto: CreatePostDto) {}
}

@CommandHandler(CreatPostCommand)
export class CreatePostUseCase implements ICommandHandler<
  CreatPostCommand,
  Result<PostViewDto>
> {
  constructor(
    @InjectModel(Post.name)
    private postModel: PostModelType,
    private postRepository: PostRepository,
  ) {}

  async execute({ dto }: CreatPostCommand): Promise<Result<PostViewDto>> {
    const entity = await this.postModel.create(dto);

    await this.postRepository.save(entity);

    const blog = await this.postRepository.findPostById(entity._id);

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
        data: PostViewDto.mapToView(blog.data),
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
