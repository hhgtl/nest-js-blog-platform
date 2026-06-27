import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ _id: false })
export class CommentatorInfo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;
}

@Schema()
export class Comments {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: CommentatorInfo })
  commentatorInfo: CommentatorInfo;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type CommentsDocument = HydratedDocument<Comments>;
export const CommentsSchema = SchemaFactory.createForClass(Comments);
export type CommentsModelType = Model<CommentsDocument> & typeof Comments;
