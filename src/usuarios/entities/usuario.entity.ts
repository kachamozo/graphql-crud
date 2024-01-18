import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Tarea } from 'src/tareas/entities/tarea.entity';

@ObjectType()
@Schema()
export class Usuario {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
  email: string;

  @Field(() => String)
  @Prop()
  password: string;

  @Field(() => [Tarea])
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Tarea' }])
  tareas?: Types.ObjectId[];
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
