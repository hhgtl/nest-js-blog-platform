import { IsString, Length, Matches } from 'class-validator';
import { CreateBlogDto } from '../../dto/blogs.dto';

export class CreateBlogInputDto implements CreateBlogDto {
  @IsString({ message: 'Name must be a string' })
  @Length(1, 15, { message: 'Name must be between 1 and 15 characters' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @Length(1, 500, {
    message: 'Description must be between 1 and 100 characters',
  })
  description: string;

  @IsString()
  @Length(1, 100, {
    message: 'Website URL must be between 1 and 100 characters',
  })
  @Matches(
    /^https?:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,63}(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]*)?$/,
    {
      message:
        'Website URL must be a valid URL starting with http:// or https://',
    },
  )
  websiteUrl: string;
}
