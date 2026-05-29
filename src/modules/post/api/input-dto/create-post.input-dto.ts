import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
import { CreatePostDto } from '../../dto/post.dto';
import { Transform } from 'class-transformer';

export class CreatePostInputDto implements CreatePostDto {
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

  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'BlogId must be a string' })
  @IsNotEmpty()
  @MinLength(1, { message: 'BlogId is required' })
  blogId: string;
}
