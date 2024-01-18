import { InputType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { LoginDto } from './login.dto';

@InputType()
export class RegisterDto extends LoginDto {
  @Field(() => String)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  name: string;
}
