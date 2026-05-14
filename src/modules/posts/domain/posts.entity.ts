import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class Posts {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;
}

export type PostsDocument = HydratedDocument<Posts>;
export const PostsSchema = SchemaFactory.createForClass(Posts);
export type PostsModelType = Model<PostsDocument> & typeof Posts;
