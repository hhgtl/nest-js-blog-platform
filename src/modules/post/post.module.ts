import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Post, PostSchema } from './domain/post.entity';
import { PostController } from './api/post.controller';
import { GetPostsQueryHandler } from './application/queries/get-posts.query-handler';
import { PostQueryRepository } from './infrastructure/query/post.query-repository';
import { CreatePostUseCase } from './application/usecases/create-post.usecase';
import { PostRepository } from './infrastructure/post.repository';
import { BlogsModule } from '../blogs/blogs.module';
import { GetPostByIdQueryHandler } from './application/queries/get-post-by-id.query-handler';
import { UpdatePostUseCase } from './application/usecases/update-post.usecase';
import { DeletePostUseCase } from './application/usecases/delete-post.usecase';
import { GetPostsByBlogIdHandler } from './application/queries/get-posts-by-blog-id.query-handler';
import { CreatePostByBlogIdUseCase } from './application/usecases/create-post-by-blogId.usecase';
import { CommentsModule } from '../comments/comments.module';
import {
  CreateCommentByPostIdCommand,
  CreateCommentByPostIdUseCase,
} from './application/usecases/create-comment-by-post-id.usecase';
import { UserModule } from '../user/user.module';
import { Comments, CommentsSchema } from '../comments/domain/comments.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comments.name, schema: CommentsSchema },
    ]),
    CqrsModule,
    BlogsModule,
    CommentsModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [
    GetPostsQueryHandler,
    GetPostByIdQueryHandler,
    GetPostsByBlogIdHandler,
    CreatePostUseCase,
    CreatePostByBlogIdUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    PostQueryRepository,
    PostRepository,
    CreateCommentByPostIdUseCase,
  ],
  exports: [GetPostsByBlogIdHandler],
})
export class PostModule {}
