import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Post, PostSchema } from './domain/post.entity';
import { PostController } from './api/post.controller';
import { GetPostsQueryHandler } from './application/queries/get-posts.query-handler';
import { PostQueryRepository } from './infrastructure/query/post.query-repository';
import { CreatePostUseCase } from './application/usecases/create-post.usecase';
import { PostRepository } from './infrastructure/post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    CqrsModule,
  ],
  controllers: [PostController],
  providers: [
    GetPostsQueryHandler,
    CreatePostUseCase,
    PostQueryRepository,
    PostRepository,
  ],
})
export class PostModule {}
