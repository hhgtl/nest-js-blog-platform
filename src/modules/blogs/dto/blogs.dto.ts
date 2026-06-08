export class CreateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export class CreatePostByBlogIdDto {
  title: string;
  shortDescription: string;
  content: string;
}
