import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { LoginDto } from '../../dto/auth.dto';

export class LoginInputDto implements LoginDto {
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Login must be a string' })
  @IsNotEmpty()
  loginOrEmail: string;

  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  password: string;
}
