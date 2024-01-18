import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { RegisterDto } from './dto/regsiter.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}
  //<--------------------REGISTER------------------->
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.findOneByEmail(registerDto.email);

    if (user) throw new BadRequestException('El usuario ya esta registrado');

    const hash = await bcrypt.hash(registerDto.password, 10);
    registerDto = { ...registerDto, password: hash };
    return this.usersService.create(registerDto);
  }

  //<-----------------LOGIN-------------------->
  async login(loginDto: LoginDto) {
    const findUser = await this.usersService.findOneByEmail(loginDto.email);
    // console.log(findUser);
    if (!findUser) throw new NotFoundException('Usuario no encontrado');

    const checkPassword = await bcrypt.compare(
      loginDto.password,
      findUser.password,
    );
    if (!checkPassword) throw new UnauthorizedException('Contraseña invalida');

    // el payload es el cuerpo donde definimos lo q quiero q contenga la firma del jwt + mi palabra secreta
    // OJO-> no se debe colocar informacion privada ej: password
    const payload = { email: findUser.email };
    const token = this.jwtService.sign(payload);
    // console.log(token);

    // Para devolver esta estructura nos tenemos que crear un nuevo dto
    return {
      email: findUser.email,
      token,
    };
  }
}
