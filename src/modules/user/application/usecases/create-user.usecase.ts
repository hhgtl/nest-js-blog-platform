import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExtensionType, Result } from '../../../../core/types/result';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../user/domain/user.entity';
import { UserViewDto } from '../../api/view-dto/user.view-dto';
import { CreateUserDto } from '../../dto/user.dto';
import { type UserModelType } from '../../domain/user.entity';
import { UserRepository } from '../../infrastructure/user.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { bcryptService } from '../../../../core/services/hash-service';

export class CreatUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreatUserCommand)
export class CreateUserUseCase implements ICommandHandler<
  CreatUserCommand,
  Result<UserViewDto>
> {
  constructor(private userRepository: UserRepository) {}

  async execute({ dto }: CreatUserCommand): Promise<Result<UserViewDto>> {
    const errorMessages: ExtensionType[] = [];
    const { email, password, login } = dto;

    const isEmailUnique = await this.userRepository.findUserByEmail(email);
    const isLoginUnique = await this.userRepository.findUserByLogin(login);

    if (isEmailUnique) {
      errorMessages.push({ field: 'email', message: 'email should be unique' });
    }

    if (isLoginUnique) {
      errorMessages.push({ field: 'login', message: 'login should be unique' });
    }

    if (errorMessages.length > 0) {
      return {
        status: ResultStatus.BadRequest,
        extensions: errorMessages,
        data: null,
      };
    }

    const hashedPassword = await bcryptService.generateHash(password);

    const newUser = {
      email: email.toLowerCase(),
      password: hashedPassword,
      login,
      createdAt: new Date(),
      // emailConfirmation: {
      //   confirmationCode: randomUUID(),
      //   confirmationCodeExpirationDate: addHours(new Date(), 12),
      //   isConfirmed: true,
      // },
    };

    const user = await this.userRepository.createUser(newUser);

    return {
      status: ResultStatus.Success,
      extensions: errorMessages,
      data: UserViewDto.mapToView(user),
    };
  }
}
