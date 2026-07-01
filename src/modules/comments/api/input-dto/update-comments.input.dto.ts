import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateCommentDto } from '../../dto/comment.dto';

export class UpdateCommentsInputDto implements CreateCommentDto {
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty()
  @Length(20, 300, {
    message: 'Content must be between 20 and 300 characters',
  })
  content: string;
}
