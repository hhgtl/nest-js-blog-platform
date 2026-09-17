import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { RegistrationEmailResendingDto } from '../../dto/auth.dto';

export class RegistrationEmailResendingInputDto implements RegistrationEmailResendingDto {
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty()
  @Matches('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
  email: string;
}
