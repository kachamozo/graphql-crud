// Importa los decoradores necesarios
import { ObjectType, Field } from '@nestjs/graphql';

// Define el tipo GraphQL para la respuesta de inicio de sesión
@ObjectType()
export class LoginResponse {
  @Field(() => String) // Esto indica que el campo es visible en GraphQL
  email: string;

  @Field(() => String)
  token: string;
}
