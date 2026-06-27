import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateCommentDto } from '../../../comments/dto/comment.dto';

export class CreateCommentByPostIdInputDto implements CreateCommentDto {
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Short description must be a string' })
  @IsNotEmpty()
  @Length(20, 300, {
    message: 'Short description must be between 20 and 300 characters',
  })
  content: string;
}
