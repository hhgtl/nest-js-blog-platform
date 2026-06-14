import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, type UserModelType } from '../domain/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findUserByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login });
  }

  async createUser(newUser: User): Promise<UserDocument> {
    return this.userModel.create(newUser);
  }
}
