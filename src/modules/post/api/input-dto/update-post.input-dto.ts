import { PartialType } from '@nestjs/mapped-types';
import { CreatePostInputDto } from './create-post.input-dto';

export class UpdatePostInputDto extends PartialType(CreatePostInputDto) {}
