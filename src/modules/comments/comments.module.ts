import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Comments, CommentsSchema } from './domain/comments.entity';
import { CommentsQueryRepository } from './infrastructure/query/comments.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    CqrsModule,
  ],
  controllers: [],
  providers: [CommentsQueryRepository],
  exports: [CommentsQueryRepository],
})
export class CommentsModule {}
