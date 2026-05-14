import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { type BlogModelType, Blogs } from '../../domain/blogs.entity';
import { CreateBlogDto } from '../../dto/blogs.dto';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<
  CreateBlogCommand,
  Types.ObjectId
> {
  constructor(
    @InjectModel(Blogs.name)
    private blogsModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreateBlogCommand): Promise<Types.ObjectId> {
    const entity = await this.blogsModel.create(dto);

    await this.blogsRepository.save(entity);

    return entity._id;
  }
}
