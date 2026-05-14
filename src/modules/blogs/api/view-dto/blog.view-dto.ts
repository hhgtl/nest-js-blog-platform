import { BlogsDocument } from '../../domain/blogs.entity';

export class BlogViewDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;

  static mapToView(Blog: BlogsDocument): BlogViewDto {
    const dto = new BlogViewDto();
    dto.id = Blog._id.toString();
    dto.name = Blog.name;
    dto.description = Blog.description;
    dto.websiteUrl = Blog.websiteUrl;

    return dto;
  }
}
