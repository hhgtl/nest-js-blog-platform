import { CommentsDocument } from '../../domain/comments.entity';

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;

  static mapToView(Comment: CommentsDocument): CommentViewDto {
    const dto = new CommentViewDto();
    dto.id = Comment._id.toString();
    dto.content = Comment.content;
    dto.commentatorInfo = {
      userId: Comment.commentatorInfo.userId,
      userLogin: Comment.commentatorInfo.userLogin,
    };
    dto.createdAt = Comment.createdAt;

    return dto;
  }
}
