import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class JwtRefreshBlackList {
  @Prop({ required: true })
  jwt: string;
}

export type JwtRefreshBlackListDocument = HydratedDocument<JwtRefreshBlackList>;
export const JwtRefreshBlackListSchema =
  SchemaFactory.createForClass(JwtRefreshBlackList);
export type JwtRefreshBlackListModelType = Model<JwtRefreshBlackListDocument> &
  typeof JwtRefreshBlackList;
