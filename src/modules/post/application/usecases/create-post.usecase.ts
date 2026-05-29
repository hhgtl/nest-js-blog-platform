import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { ResultStatus } from '../../../../core/types/result-code';
import { Result } from '../../../../core/types/result';
import { Post, type PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostRepository } from '../../infrastructure/post.repository';
import { CreatePostDto } from '../../dto/post.dto';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';

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
    private blogRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreatPostCommand): Promise<Result<PostViewDto>> {
    const { blogId, shortDescription, content, title } = dto;

    const blog = await this.blogRepository.findBlogById(blogId);

    if (blog.status !== ResultStatus.Success) {
      return {
        data: null,
        status: blog.status,
        errorMessage: '',
        extensions: [],
      };
    }

    const newPost: Post = {
      title,
      shortDescription,
      content,
      blogName: blog.data.name,
      blogId: blog.data.id,
      createdAt: blog.data.createdAt,
    };

    const createdPost = await this.postModel.create(newPost);

    return {
      data: PostViewDto.mapToView(createdPost),
      status: ResultStatus.Success,
      errorMessage: '',
      extensions: [],
    };
  }
}
