import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constants';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    //importo el module para poder usar sus servicios
    UsuariosModule,
    //Estamos registrando el JwtModule como global para facilitarnos las cosas.
    //Esto significa que no necesitamos importar JwtModule ningún otro lugar de nuestra aplicación.
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  providers: [AuthService, AuthResolver, AuthGuard],
})
export class AuthModule {}
