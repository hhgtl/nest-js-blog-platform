import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { User, UserSchema } from './domain/user.entity';
import { UserController } from './api/user.controller';
import { GetUsersQueryHandler } from './application/queries/get-users.query-handler';
import { UserQueryRepository } from './infrastructure/query/user.query-repository';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { UserRepository } from './infrastructure/user.repository';
import { DeleteUserUseCase } from './application/usecases/delete-user-by-id.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [
    GetUsersQueryHandler,
    CreateUserUseCase,
    DeleteUserUseCase,
    UserQueryRepository,
    UserRepository,
  ],
  exports: [],
})
export class UserModule {}
