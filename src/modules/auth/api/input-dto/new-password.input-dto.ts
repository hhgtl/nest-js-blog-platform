import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { NewPasswordDto } from '../../dto/auth.dto';

export class NewPasswordInputDto implements NewPasswordDto {
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  @Length(6, 20, {
    message: 'Password must be between 6 and 20 characters',
  })
  newPassword: string;

  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Recovery code must be a string' })
  @IsNotEmpty()
  recoveryCode: string;
}
