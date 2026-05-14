import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlogViewDto } from './view-dto/blog.view-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogsQuery } from '../application/queries/get-blogs.query-handler';
import { CreateBlogInputDto } from './input-dto/create-blog.input-dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { Types } from 'mongoose';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAll(): Promise<BlogViewDto[]> {
    return this.queryBus.execute(new GetBlogsQuery());
  }

  @Post()
  async create(@Body() dto: CreateBlogInputDto): Promise<Types.ObjectId> {
    return this.commandBus.execute(new CreateBlogCommand(dto));
  }
}
