import { CreateUsuarioDto } from './create-usuario.dto';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
//cuando extiendes con PartialType -> lasp props como nombre, correo las vuelve opcionales
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
