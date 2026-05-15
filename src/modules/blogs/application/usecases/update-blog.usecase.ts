import { Types } from 'mongoose';
import { UpdateBlogInputDto } from '../../api/input-dto/update-blog.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class UpdateBlogCommand {
  constructor(
    public id: Types.ObjectId,
    public dto: UpdateBlogInputDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<
  UpdateBlogCommand,
  void
> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ id, dto }: UpdateBlogCommand): Promise<void> {
    const entity = await this.blogsRepository.findUserById(id);

    if (entity.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    if (entity.status === ResultStatus.Success) {
      const userEntity = entity.data;
      userEntity.updateOne(dto);

      await this.blogsRepository.save(userEntity);
    }

    throw new InternalServerErrorException();
  }
}
