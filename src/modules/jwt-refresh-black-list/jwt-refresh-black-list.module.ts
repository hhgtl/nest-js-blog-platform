import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JwtRefreshBlackList,
  JwtRefreshBlackListSchema,
} from './domain/jwt-refresh-black-list.entity';
import { JwtRefreshBlackListRepository } from './infrastructure/jwt-refresh-black-list.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JwtRefreshBlackList.name, schema: JwtRefreshBlackListSchema },
    ]),
  ],
  providers: [JwtRefreshBlackListRepository],
  exports: [JwtRefreshBlackListRepository],
})
export class JwtRefreshBlackListModule {}
