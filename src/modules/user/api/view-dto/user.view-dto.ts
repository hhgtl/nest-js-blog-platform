import { UserDocument } from '../../domain/user.entity';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: Date;

  static mapToView(Blog: UserDocument): UserViewDto {
    const dto = new UserViewDto();
    dto.id = Blog._id.toString();
    dto.login = Blog.login;
    dto.email = Blog.email;
    dto.createdAt = Blog.createdAt;

    return dto;
  }
}
