import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class RateLimit {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  date: Date;
}

export type RateLimitDocument = HydratedDocument<RateLimit>;
export const RateLimitSchema = SchemaFactory.createForClass(RateLimit);
export type RateLimitModelType = Model<RateLimitDocument> & typeof RateLimit;
