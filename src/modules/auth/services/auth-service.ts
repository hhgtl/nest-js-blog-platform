import { UserRepository } from '../../user/infrastructure/user.repository';
import { ResultStatus } from '../../../core/types/result-code';
import { bcryptService } from '../../../core/services/hash-service';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async checkUserCredentials({
    loginOrEmail,
    password,
  }: {
    loginOrEmail: string;
    password: string;
  }) {
    const user = await this.userRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
      };
    }

    const isPassCorrect = await bcryptService.checkPassword(
      password,
      user.password,
    );

    if (!isPassCorrect)
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'password', message: 'Wrong password' }],
      };

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  }
}
