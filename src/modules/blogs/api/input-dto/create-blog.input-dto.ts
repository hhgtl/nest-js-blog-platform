import { IsString } from 'class-validator';
import { CreateBlogDto } from '../../dto/blogs.dto';

export class CreateBlogInputDto implements CreateBlogDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  websiteUrl: string;
}
