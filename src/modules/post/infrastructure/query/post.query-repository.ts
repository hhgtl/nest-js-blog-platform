import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Result } from '../../../../core/types/result';
import { ResultStatus } from '../../../../core/types/result-code';
import { Post, type PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../api/view-dto/post.view-dto';

@Injectable()
export class PostQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}

  async getAllPosts(): Promise<PostViewDto[]> {
    const entities = await this.postModel.find();

    return entities.map((e) => PostViewDto.mapToView(e));
  }

  async getPostById(_id: Types.ObjectId): Promise<Result<PostViewDto>> {
    const entity = await this.postModel.findOne({
      _id,
    });

    if (!entity) {
      return {
        data: null,
        status: ResultStatus.NotFound,
        errorMessage: '',
        extensions: [],
      };
    }

    return {
      data: PostViewDto.mapToView(entity),
      status: ResultStatus.Success,
      errorMessage: '',
      extensions: [],
    };
  }
}
