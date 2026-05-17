import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
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
import { ResultStatus } from '../../../core/types/result-code';
import { Result } from '../../../core/types/result';

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
    const entity = await this.commandBus.execute<
      UpdateBlogCommand,
      Result<null>
    >(new UpdateBlogCommand(id, dto));

    if (entity.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (entity.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId): Promise<void> {
    const entity = await this.commandBus.execute<
      DeleteBlogCommand,
      Result<null>
    >(new DeleteBlogCommand(id));

    if (entity.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (entity.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }
}
