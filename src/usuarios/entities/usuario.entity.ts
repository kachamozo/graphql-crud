import {
  ObjectType,
  Field,
  ID,
  FieldMiddleware,
  MiddlewareContext,
  NextFn,
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Tarea } from 'src/tareas/entities/tarea.entity';

const loguerMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  console.log(value);
  return value?.toUpperCase();
};

@ObjectType()
@Schema()
export class Usuario {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String, { middleware: [loguerMiddleware] })
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
