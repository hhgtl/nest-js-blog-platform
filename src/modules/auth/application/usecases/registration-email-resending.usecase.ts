import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { RegistrationEmailResendingDto } from '../../dto/auth.dto';
import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';
import { nodemailerAdapter } from '../../../../core/adapters/nodemailer-adapter';

export class RegistrationEmailResendingCommand {
  constructor(public dto: RegistrationEmailResendingDto) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<
  RegistrationEmailResendingCommand,
  Result<null>
> {
  constructor(private userRepository: UserRepository) {}

  async execute({
    dto,
  }: RegistrationEmailResendingCommand): Promise<Result<null>> {
    const { email } = dto;

    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'email', message: 'User not found' }],
      };
    }

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'email', message: 'Email is already confirmed' }],
      };
    }

    const confirmationCode = randomUUID();

    user.emailConfirmation.confirmationCode = confirmationCode;
    user.emailConfirmation.confirmationCodeExpirationDate = addHours(
      new Date(),
      12,
    );
    await this.userRepository.save(user);

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
