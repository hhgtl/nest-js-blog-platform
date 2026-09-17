export class LoginDto {
  loginOrEmail: string;
  password: string;
}

export class RegistrationConfirmationDto {
  code: string;
}

export class RegistrationEmailResendingDto {
  email: string;
}
