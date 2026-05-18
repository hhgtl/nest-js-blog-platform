import { PostDocument } from '../../domain/post.entity';

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;

  static mapToView(Blog: PostDocument): PostViewDto {
    const dto = new PostViewDto();
    dto.id = Blog._id.toString();
    dto.title = Blog.title;
    dto.shortDescription = Blog.shortDescription;
    dto.content = Blog.content;
    dto.blogId = Blog.blogId;
    dto.blogName = Blog.blogName;

    return dto;
  }
}
