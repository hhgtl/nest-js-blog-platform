import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogViewDto } from './view-dto/blog.view-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogsQuery } from '../application/queries/get-blogs.query-handler';
import { CreateBlogInputDto } from './input-dto/create-blog.input-dto';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { Types } from 'mongoose';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { UpdateBlogInputDto } from './input-dto/update-blog.input-dto';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';

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
  async createBlog(@Body() dto: CreateBlogInputDto): Promise<Types.ObjectId> {
    return this.commandBus.execute(new CreateBlogCommand(dto));
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Body() dto: UpdateBlogInputDto,
    @Param('id') id: Types.ObjectId,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateBlogCommand(id, dto));
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId): Promise<void> {
    return this.commandBus.execute(new DeleteBlogCommand(id));
  }
}
