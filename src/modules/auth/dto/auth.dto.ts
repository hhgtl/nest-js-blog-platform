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

export class PasswordRecoveryDto {
  email: string;
}

export class NewPasswordDto {
  newPassword: string;
  recoveryCode: string;
}
