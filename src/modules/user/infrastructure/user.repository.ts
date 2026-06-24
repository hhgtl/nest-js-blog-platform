import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, type UserModelType } from '../domain/user.entity';
import { Result } from '../../../core/types/result';
import { ResultStatus } from '../../../core/types/result-code';
import { Types } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async findUserById(userId: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: userId });
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findUserByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login });
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    const regex = new RegExp(`^${loginOrEmail}$`, 'i');
    return this.userModel.findOne({
      $or: [{ email: regex }, { login: loginOrEmail }],
    });
  }

  async createUser(newUser: User): Promise<UserDocument> {
    return this.userModel.create(newUser);
  }

  async deleteUserById(_id: Types.ObjectId): Promise<Result<null>> {
    const deleteResult = await this.userModel.deleteOne({ _id });

    if (deleteResult.deletedCount === 1) {
      return {
        data: null,
        status: ResultStatus.Success,
        errorMessage: '',
        extensions: [],
      };
    }

    return {
      data: null,
      status: ResultStatus.NotFound,
      errorMessage: '',
      extensions: [],
    };
  }
}
