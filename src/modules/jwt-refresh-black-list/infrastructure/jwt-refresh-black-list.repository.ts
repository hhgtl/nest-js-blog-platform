import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  JwtRefreshBlackList,
  JwtRefreshBlackListDocument,
  type JwtRefreshBlackListModelType,
} from '../domain/jwt-refresh-black-list.entity';

@Injectable()
export class JwtRefreshBlackListRepository {
  constructor(
    @InjectModel(JwtRefreshBlackList.name)
    private jwtRefreshBlackListModel: JwtRefreshBlackListModelType,
  ) {}

  async addJwtToBlackList(jwt: string): Promise<JwtRefreshBlackListDocument> {
    return this.jwtRefreshBlackListModel.create({ jwt });
  }

  async findJwtInBlackList(
    jwt: string,
  ): Promise<JwtRefreshBlackListDocument | null> {
    return this.jwtRefreshBlackListModel.findOne({ jwt });
  }
}
