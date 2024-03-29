import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
// import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { IsOptional } from 'class-validator';

@ObjectType()
@Schema()
export class Tarea {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop()
  nombre: string;

  @Field(() => String)
  @Prop()
  descripcion: string;

  @Field(() => Usuario)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  @IsOptional()
  usuario?: Types.ObjectId;
}
export const TareaSchema = SchemaFactory.createForClass(Tarea);
