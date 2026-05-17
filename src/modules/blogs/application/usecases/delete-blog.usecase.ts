import { Types } from 'mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { Result } from '../../../../core/types/result';

export class DeleteBlogCommand {
  constructor(public id: Types.ObjectId) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<
  DeleteBlogCommand,
  Result<null>
> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<Result<null>> {
    return this.blogsRepository.deleteBlogById(id);
  }
}
