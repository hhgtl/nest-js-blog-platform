import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class SecurityDevices {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  lastActiveDate: string;

  @Prop({ required: true })
  iat: number;

  @Prop({ required: true })
  exp: number;
}

export type SecurityDevicesDocument = HydratedDocument<SecurityDevices>;
export const SecurityDevicesSchema =
  SchemaFactory.createForClass(SecurityDevices);
export type SecurityDevicesModelType = Model<SecurityDevicesDocument> &
  typeof SecurityDevices;
