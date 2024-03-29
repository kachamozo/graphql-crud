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
import { Tarea } from '../../tareas/entities/tarea.entity';
import * as bcrypt from 'bcrypt';

//<-------------Middleware Graphql--------------->
export const mayusculaMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  //console.log(ctx.info.path.prev.key);
  if (ctx.info.path.prev.key === 'buscarUsuario') {
    const value = await next();
    return value.toUpperCase();
  }
  return next();
};

@ObjectType()
@Schema()
export class Usuario {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String, { middleware: [mayusculaMiddleware] })
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

UsuarioSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Solo hashea la contraseña si el usuario es nuevo
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});
