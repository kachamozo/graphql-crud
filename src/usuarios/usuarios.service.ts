import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
  ) {}

  create(createUsuario: CreateUsuarioDto) {
    return this.usuarioModel.create(createUsuario);
  }

  findOneByEmail(email: string) {
    return this.usuarioModel.findOne({ email });
  }

  findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().populate('tareas').exec();
  }

  findOneById(id: string): Promise<Usuario> {
    return this.usuarioModel.findById(id);
  }
  async update(id: string, updateUsuario: UpdateUsuarioDto) {
    const findUser = await this.usuarioModel.findById(id).exec();
    if (!findUser)
      throw new HttpException('Usuario no encontrado', HttpStatus.FORBIDDEN);
    return this.usuarioModel.findByIdAndUpdate(id, updateUsuario, {
      new: true,
    });
  }
  async delete(id: string) {
    const findUser = await this.usuarioModel.findById(id);
    if (!findUser)
      throw new HttpException('Usuario no encontrado', HttpStatus.FORBIDDEN);
    return this.usuarioModel.findByIdAndDelete(id);
  }
}
