import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPostsQuery } from '../application/queries/get-posts.query-handler';
import { BlogViewDto } from '../../blogs/api/view-dto/blog.view-dto';
import { Result } from '../../../core/types/result';
import { ResultStatus } from '../../../core/types/result-code';
import { CreatePostInputDto } from './input-dto/create-post.input-dto';
import { CreatPostCommand } from '../application/usecases/create-post.usecase';
import { PostViewDto } from './view-dto/post.view-dto';
import { Types } from 'mongoose';
import { GetBlogsByIdQuery } from '../../blogs/application/queries/get-blogs-by-id.query-handler';
import { GetPostByIdQuery } from '../application/queries/get-post-by-id.query-handler';

@Controller('post')
export class PostController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getAllPosts(): Promise<PostViewDto> {
    return this.queryBus.execute(new GetPostsQuery());
  }

  @Get(':id')
  async getPostById(@Param('id') id: Types.ObjectId): Promise<PostViewDto> {
    const entity = await this.queryBus.execute<
      GetPostByIdQuery,
      Result<PostViewDto>
    >(new GetPostByIdQuery(id));

    if (entity.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (entity.status === ResultStatus.Success) {
      return entity.data;
    }

    throw new InternalServerErrorException();
  }

  @Post()
  async createPost(@Body() dto: CreatePostInputDto): Promise<PostViewDto> {
    const entity = await this.commandBus.execute<
      CreatPostCommand,
      Result<PostViewDto>
    >(new CreatPostCommand(dto));

    if (entity.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (entity.status === ResultStatus.Success) {
      return entity.data;
    }

    throw new InternalServerErrorException();
  }
}
