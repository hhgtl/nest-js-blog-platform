import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreatePostByBlogIdDto } from '../../dto/blogs.dto';

export class CreatePostByBlogIdInputDto implements CreatePostByBlogIdDto {
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty()
  @Length(1, 30, {
    message: 'Title must be between 1 and 30 characters',
  })
  title: string;

  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Short description must be a string' })
  @IsNotEmpty()
  @Length(1, 100, {
    message: 'Short description must be between 1 and 100 characters',
  })
  shortDescription: string;

  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty()
  @Length(1, 1000, {
    message: 'Content must be between 1 and 1000 characters',
  })
  content: string;
}
