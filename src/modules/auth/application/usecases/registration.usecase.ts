import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExtensionType, Result } from '../../../../core/types/result';
import { CreateUserDto } from '../../../user/dto/user.dto';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { bcryptService } from '../../../../core/services/hash-service';
import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';
import { nodemailerAdapter } from '../../../../core/adapters/nodemailer-adapter';

export class RegistrationCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase implements ICommandHandler<
  RegistrationCommand,
  Result<null>
> {
  constructor(private userRepository: UserRepository) {}

  async execute({ dto }: RegistrationCommand): Promise<Result<null>> {
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

    const confirmationCode = randomUUID();

    const newUser = {
      email: email.toLowerCase(),
      password: hashedPassword,
      login,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode,
        confirmationCodeExpirationDate: addHours(new Date(), 12),
        isConfirmed: false,
      },
    };

    await this.userRepository.createUser(newUser);

    nodemailerAdapter
      .sendEmail({ email, confirmationCode })
      .catch(console.error);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
