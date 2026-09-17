import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../core/types/result';
import { UserRepository } from '../../../user/infrastructure/user.repository';
import { ResultStatus } from '../../../../core/types/result-code';
import { NewPasswordDto } from '../../dto/auth.dto';
import { bcryptService } from '../../../../core/services/hash-service';

export class NewPasswordCommand {
  constructor(public dto: NewPasswordDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<
  NewPasswordCommand,
  Result<null>
> {
  constructor(private userRepository: UserRepository) {}

  async execute({ dto }: NewPasswordCommand): Promise<Result<null>> {
    const { newPassword, recoveryCode } = dto;

    const user = await this.userRepository.findUserByRecoveryCode(recoveryCode);

    if (!user?.passwordRecovery) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [
          { field: 'recoveryCode', message: 'Recovery code is incorrect' },
        ],
      };
    }

    if (user.passwordRecovery.recoveryCodeExpirationDate < new Date()) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [
          { field: 'recoveryCode', message: 'Recovery code is expired' },
        ],
      };
    }

    user.password = await bcryptService.generateHash(newPassword);
    user.passwordRecovery = undefined;
    await this.userRepository.save(user);

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
  }
}
