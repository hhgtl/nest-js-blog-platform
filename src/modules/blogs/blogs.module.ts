import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller';
import { GetBlogsQueryHandler } from './application/queries/get-blogs.query-handler';
import { BlogsQueryRepository } from './infrastructure/query/blogs.query-repository';
import { CreateBlogUseCase } from './application/usecases/create-blog.usecase';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { DeleteBlogUseCase } from './application/usecases/delete-blog.usecase';
import { UpdateBlogUseCase } from './application/usecases/update-blog.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { Blogs, BlogsSchema } from './domain/blogs.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { GetBlogsByIdQueryHandler } from './application/queries/get-blogs-by-id.query-handler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blogs.name, schema: BlogsSchema }]),
    CqrsModule,
  ],
  controllers: [BlogsController],
  providers: [
    GetBlogsQueryHandler,
    GetBlogsByIdQueryHandler,
    BlogsQueryRepository,
    CreateBlogUseCase,
    DeleteBlogUseCase,
    UpdateBlogUseCase,
    BlogsRepository,
  ],
})
export class BlogsModule {}
