import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { RegisterDto } from './dto/regsiter.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login-response.dto';

@Resolver(() => Usuario)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Usuario, { name: 'registrarUsuario' })
  register(@Args('dataUser') registerUser: RegisterDto) {
    return this.authService.register(registerUser);
  }

  // El LoginResponse es un nuevo dto para que nuestra respuesta solo tenga los datos que se necesita en el front(email, token) POR SEGURIDAD
  @Mutation(() => LoginResponse, { name: 'loginUsuario' })
  login(@Args('loginUser') loginUser: LoginDto) {
    return this.authService.login(loginUser);
  }
}
