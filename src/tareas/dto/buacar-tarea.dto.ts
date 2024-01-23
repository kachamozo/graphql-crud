import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class BuscarTareaDto {
  @Field(() => ID)
  @IsNotEmpty()
  _id: Types.ObjectId;
}
