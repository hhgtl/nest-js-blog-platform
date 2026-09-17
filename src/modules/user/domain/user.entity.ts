import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ _id: false })
export class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  confirmationCodeExpirationDate: Date;

  @Prop({ required: true })
  isConfirmed: boolean;
}

@Schema({ _id: false })
export class PasswordRecovery {
  @Prop({ required: true })
  recoveryCode: string;

  @Prop({ required: true })
  recoveryCodeExpirationDate: Date;
}

@Schema()
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true, type: EmailConfirmation })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: PasswordRecovery })
  passwordRecovery?: PasswordRecovery;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
export type UserModelType = Model<UserDocument> & typeof User;
