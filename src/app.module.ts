import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogs, BlogsSchema } from './modules/blogs/domain/blogs.entity';
import { BlogsController } from './modules/blogs/api/blogs.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetBlogsQueryHandler } from './modules/blogs/application/queries/get-blogs.query-handler';
import { BlogsQueryRepository } from './modules/blogs/infrastructure/query/blogs.query-repository';
import { BlogsRepository } from './modules/blogs/infrastructure/blogs.repository';
import { CreateBlogUseCase } from './modules/blogs/application/usecases/create-blog.usecase';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'blogger-platform',
    }),
    MongooseModule.forFeature([{ name: Blogs.name, schema: BlogsSchema }]),
    CqrsModule,
  ],
  controllers: [AppController, BlogsController],
  providers: [
    AppService,
    GetBlogsQueryHandler,
    BlogsQueryRepository,
    CreateBlogUseCase,
    BlogsRepository,
  ],
})
export class AppModule {}
