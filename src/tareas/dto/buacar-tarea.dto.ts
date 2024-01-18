import { Field, ID, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class BuscarTareaDto {
  @Field(() => ID)
  _id: Types.ObjectId;
}
