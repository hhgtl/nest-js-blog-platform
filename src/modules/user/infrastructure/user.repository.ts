import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserModelType } from '../domain/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async createUser() {
    return null;
  }
}
