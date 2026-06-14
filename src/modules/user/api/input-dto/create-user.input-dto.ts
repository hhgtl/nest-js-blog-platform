import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { CreateUserDto } from '../../dto/user.dto';

export class CreateUserInputDto implements CreateUserDto {
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Login must be a string' })
  @IsNotEmpty()
  @Length(3, 10, {
    message: 'Login must be between 3 and 10 characters',
  })
  login: string;

  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  @Length(6, 20, {
    message: 'Password must be between 6 and 20 characters',
  })
  password: string;

  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty()
  @Matches('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
  email: string;
}
