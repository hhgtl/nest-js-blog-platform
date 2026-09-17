import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PasswordRecoveryDto } from '../../dto/auth.dto';

export class PasswordRecoveryInputDto implements PasswordRecoveryDto {
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty()
  @Matches('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
  email: string;
}
