import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { PasswordRecoveryDto } from '../../dto/auth.dto';
import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';
import { nodemailerAdapter } from '../../../../core/adapters/nodemailer-adapter';

export class PasswordRecoveryCommand {
  constructor(public dto: PasswordRecoveryDto) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<
  PasswordRecoveryCommand,
  Result<null>
> {
  constructor(private userRepository: UserRepository) {}

  async execute({ dto }: PasswordRecoveryCommand): Promise<Result<null>> {
    const { email } = dto;

    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      return {
        status: ResultStatus.Success,
        data: null,
        extensions: [],
      };
    }

    const recoveryCode = randomUUID();

    user.passwordRecovery = {
      recoveryCode,
      recoveryCodeExpirationDate: addHours(new Date(), 1),
    };
    await this.userRepository.save(user);

    nodemailerAdapter
      .sendPasswordRecoveryEmail({ email, recoveryCode })
      .catch(console.error);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
