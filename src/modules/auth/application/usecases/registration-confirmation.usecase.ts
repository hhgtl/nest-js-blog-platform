import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { RegistrationConfirmationDto } from '../../dto/auth.dto';

export class RegistrationConfirmationCommand {
  constructor(public dto: RegistrationConfirmationDto) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase implements ICommandHandler<
  RegistrationConfirmationCommand,
  Result<null>
> {
  constructor(private userRepository: UserRepository) {}

  async execute({
    dto,
  }: RegistrationConfirmationCommand): Promise<Result<null>> {
    const { code } = dto;

    const user = await this.userRepository.findUserByConfirmationCode(code);

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [
          { field: 'code', message: 'Confirmation code is incorrect' },
        ],
      };
    }

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'code', message: 'Email is already confirmed' }],
      };
    }

    if (user.emailConfirmation.confirmationCodeExpirationDate < new Date()) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [
          { field: 'code', message: 'Confirmation code is expired' },
        ],
      };
    }

    user.emailConfirmation.isConfirmed = true;
    await this.userRepository.save(user);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
