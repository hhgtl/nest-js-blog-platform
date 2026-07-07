import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Comments, CommentsSchema } from './domain/comments.entity';
import { CommentsQueryRepository } from './infrastructure/query/comments.query-repository';
import { GetCommentByIdQueryHandler } from './application/queries/get-comments-by-id.query-handler';
import { DeleteCommentsUseCase } from './application/usecases/delete-comments.usecase';
import { UpdateCommentUseCase } from './application/usecases/update-comments.usecase';
import { CommentsRepository } from './infrastructure/comments.repository';
import { CommentsController } from './api/comments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    CqrsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsQueryRepository,
    CommentsRepository,
    GetCommentByIdQueryHandler,
    DeleteCommentsUseCase,
    UpdateCommentUseCase,
  ],
  exports: [CommentsQueryRepository, CommentsRepository],
})
export class CommentsModule {}
