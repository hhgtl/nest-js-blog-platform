import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { User, UserSchema } from './domain/user.entity';
import { UserController } from './api/user.controller';
import { GetUsersQueryHandler } from './application/queries/get-users.query-handler';
import { UserQueryRepository } from './infrastructure/query/user.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [GetUsersQueryHandler, UserQueryRepository],
  exports: [],
})
export class UserModule {}
