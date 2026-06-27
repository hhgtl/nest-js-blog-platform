import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { InjectModel } from '@nestjs/mongoose';
import { Post, type PostModelType } from '../../domain/post.entity';
import { PostRepository } from '../../infrastructure/post.repository';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { CommentViewDto } from '../../../comments/api/view-dto/comment.view-dto';
import { Types } from 'mongoose';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import {
  Comments,
  type CommentsModelType,
} from '../../../comments/domain/comments.entity';

export class CreateCommentByPostIdCommand {
  constructor(
    public userId: string,
    public postId: string,
    public content: string,
  ) {}
}

@CommandHandler(CreateCommentByPostIdCommand)
export class CreatePostByBlogIdUseCase implements ICommandHandler<
  CreateCommentByPostIdCommand,
  Result<CommentViewDto>
> {
  constructor(
    @InjectModel(Comments.name)
    private commentModel: CommentsModelType,
    private postRepository: PostRepository,
    private commentRepository: CommentsRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(
    dto: CreateCommentByPostIdCommand,
  ): Promise<Result<CommentViewDto>> {
    const { userId, postId, content } = dto;
    const post = await this.postRepository.findPostById(
      new Types.ObjectId(postId),
    );

    if (post.status !== ResultStatus.Success) {
      return {
        data: null,
        status: post.status,
        errorMessage: '',
        extensions: [],
      };
    }

    const user = await this.userRepository.findUserById(
      new Types.ObjectId(userId),
    );

    if (!user) {
      return {
        data: null,
        status: ResultStatus.Unauthorized,
        errorMessage: 'User not found',
        extensions: [],
      };
    }

    const newPost = {
      content,
      commentatorInfo: {
        userId,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
      postId,
    };

    const newComment = await this.commentModel.create(newPost);

    return {
      data: CommentViewDto.mapToView(newComment),
      status: ResultStatus.Success,
      errorMessage: '',
      extensions: [],
    };
  }
}
