import {
  BadRequestException,
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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPostsQuery } from '../application/queries/get-posts.query-handler';
import { Result } from '../../../core/types/result';
import { ResultStatus } from '../../../core/types/result-code';
import { CreatePostInputDto } from './input-dto/create-post.input-dto';
import { CreatPostCommand } from '../application/usecases/create-post.usecase';
import { PostViewDto } from './view-dto/post.view-dto';
import { Types } from 'mongoose';
import { GetPostByIdQuery } from '../application/queries/get-post-by-id.query-handler';
import { UpdatePostInputDto } from './input-dto/update-post.input-dto';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';
import { BaseAuthorizationGuard } from '../../../core/guards/base-authorization.guard';
import { GetPostsQueryParams } from './input-dto/post-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { CreateCommentByPostIdInputDto } from './input-dto/create-comment-by-post-id.input-dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-authorization.guard';
import { CreateCommentByPostIdCommand } from '../application/usecases/create-comment-by-post-id.usecase';
import { CommentViewDto } from '../../comments/api/view-dto/comment.view-dto';

type RequestWithUser = Request & {
  user?: { userId: string };
};

@Controller('posts')
export class PostController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getAllPosts(
    @Query()
    params: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.queryBus.execute(new GetPostsQuery(params));
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

    if (entity.status === ResultStatus.BadRequest) {
      throw new BadRequestException();
    }

    if (entity.status === ResultStatus.Success) {
      return entity.data;
    }

    throw new InternalServerErrorException();
  }

  @UseGuards(BaseAuthorizationGuard)
  @Post()
  async createPost(@Body() dto: CreatePostInputDto): Promise<PostViewDto> {
    const entity = await this.commandBus.execute<
      CreatPostCommand,
      Result<PostViewDto>
    >(new CreatPostCommand(dto));

    if (entity.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (entity.status === ResultStatus.BadRequest) {
      throw new BadRequestException();
    }

    if (entity.status === ResultStatus.Success) {
      return entity.data;
    }

    throw new InternalServerErrorException();
  }

  @UseGuards(BaseAuthorizationGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Body() dto: UpdatePostInputDto,
    @Param('id') id: Types.ObjectId,
  ): Promise<void> {
    const entity = await this.commandBus.execute<
      UpdatePostCommand,
      Result<null>
    >(new UpdatePostCommand(id, dto));

    if (entity.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (entity.status === ResultStatus.BadRequest) {
      throw new BadRequestException();
    }

    if (entity.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }

  @UseGuards(BaseAuthorizationGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: Types.ObjectId): Promise<void> {
    const entity = await this.commandBus.execute<
      DeletePostCommand,
      Result<null>
    >(new DeletePostCommand(id));

    if (entity.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (entity.status === ResultStatus.BadRequest) {
      throw new BadRequestException();
    }

    if (entity.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createComment(
    @Body() { content }: CreateCommentByPostIdInputDto,
    @Param('id') postId: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.userId!;

    const entity: Result<CommentViewDto> = await this.commandBus.execute(
      new CreateCommentByPostIdCommand(userId, postId, content),
    );

    if (entity.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (entity.status === ResultStatus.BadRequest) {
      throw new BadRequestException();
    }

    if (entity.status === ResultStatus.Success) {
      return;
    }

    throw new InternalServerErrorException();
  }
}
