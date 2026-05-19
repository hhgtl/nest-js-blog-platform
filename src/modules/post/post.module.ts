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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    CqrsModule,
    BlogsModule,
  ],
  controllers: [PostController],
  providers: [
    GetPostsQueryHandler,
    GetPostByIdQueryHandler,
    CreatePostUseCase,
    UpdatePostUseCase,
    PostQueryRepository,
    PostRepository,
  ],
})
export class PostModule {}
