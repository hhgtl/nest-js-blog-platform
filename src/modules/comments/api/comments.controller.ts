import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCommentByIdQuery } from '../application/queries/get-comments-by-id.query-handler';
import { Types } from 'mongoose';
import { ResultStatus } from '../../../core/types/result-code';
import { Result } from '../../../core/types/result';
import { CommentViewDto } from './view-dto/comment.view-dto';
import { UpdateCommentsInputDto } from './input-dto/update-comments.input.dto';
import { UpdateCommentCommand } from '../application/usecases/update-comments.usecase';
import { DeleteCommentsCommand } from '../application/usecases/delete-comments.usecase';
import { JwtAuthGuard } from '../../../core/guards/jwt-authorization.guard';

type RequestWithUser = Request & {
  user?: { userId: string };
};

@Controller('comments')
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

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updateCommentById(
    @Param('id') id: string,
    @Body() dto: UpdateCommentsInputDto,
    @Req() req: RequestWithUser,
  ) {
    const result: Result<CommentViewDto> = await this.commandBus.execute(
      new UpdateCommentCommand(id, dto, req.user!.userId),
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

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteCommentById(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    const result: Result<CommentViewDto> = await this.commandBus.execute(
      new DeleteCommentsCommand(new Types.ObjectId(id), req.user!.userId),
    );

    if (result.status === ResultStatus.BadRequest) {
      throw new BadRequestException(result.extensions);
    }

    if (result.status === ResultStatus.Unauthorized) {
      throw new UnauthorizedException(result.extensions);
    }

    if (result.status === ResultStatus.Forbidden) {
      throw new ForbiddenException(result.extensions);
    }

    if (result.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (result.status === ResultStatus.Success) {
      return result.data;
    }

    throw new InternalServerErrorException();
  }
}
