import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class Blogs {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;
}

export type BlogsDocument = HydratedDocument<Blogs>;
export const BlogsSchema = SchemaFactory.createForClass(Blogs);
export type BlogModelType = Model<BlogsDocument> & typeof Blogs;
