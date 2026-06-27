import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCommentByIdQuery } from '../application/queries/get-comments-by-id.query-handler';
import { Types } from 'mongoose';
import { ResultStatus } from '../../../core/types/result-code';
import { Result } from '../../../core/types/result';
import { CommentViewDto } from './view-dto/comment.view-dto';

@Controller('auth')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  async getCommentsById(@Param('id') id: string) {
    const result: Result<CommentViewDto> = await this.queryBus.execute(
      new GetCommentByIdQuery(new Types.ObjectId(id)),
    );

    if (result.status === ResultStatus.BadRequest) {
      throw new BadRequestException(result.extensions);
    }

    if (result.status === ResultStatus.Unauthorized) {
      throw new UnauthorizedException(result.extensions);
    }

    if (result.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (result.status === ResultStatus.Success) {
      return result.data;
    }

    throw new InternalServerErrorException();
  }

  @Put(':id')
  updateCommentById() {}

  @Delete(':id')
  deleteCommentById() {}
}
