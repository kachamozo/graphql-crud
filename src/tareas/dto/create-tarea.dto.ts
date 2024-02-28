import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTareaDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  usuarioId?: string;
}
