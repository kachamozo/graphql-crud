import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginDto {
  //El isemail ya valida muchas cosas
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  //El transform se verifica antes que todos y el minlength es otra manera de verificar que no este vacio
  @Field(() => String)
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
