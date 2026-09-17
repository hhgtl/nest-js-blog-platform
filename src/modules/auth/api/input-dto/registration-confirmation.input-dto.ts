import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegistrationConfirmationDto } from '../../dto/auth.dto';

export class RegistrationConfirmationInputDto implements RegistrationConfirmationDto {
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty()
  code: string;
}
