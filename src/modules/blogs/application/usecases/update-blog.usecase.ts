import { Types } from 'mongoose';
import { UpdateBlogInputDto } from '../../api/input-dto/update-blog.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

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
    const entity = await this.blogsRepository.findOrNotFoundFail(id);

    entity.updateOne(dto);

    await this.blogsRepository.save(entity);
  }
}
