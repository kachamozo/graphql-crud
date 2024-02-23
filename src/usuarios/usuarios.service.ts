import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';
import { Tarea } from '../tareas/entities/tarea.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/regsiter.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    @InjectModel(Tarea.name) private readonly tareaModel: Model<Tarea>,
  ) {}

  create(createUsuario: RegisterDto) {
    return this.usuarioModel.create(createUsuario);
  }

  findOneByEmail(email: string) {
    return this.usuarioModel.findOne({ email });
  }

  findAll(): Promise<Usuario[]> {
    return this.usuarioModel
      .find()
      .populate('tareas', 'nombre descripcion')
      .exec();
  }

  findOneById(id: string): Promise<Usuario> {
    return this.usuarioModel.findById(id);
  }
  async update(id: string, updateUsuario: UpdateUsuarioDto) {
    const findUser = await this.usuarioModel.findById(id).exec();
    if (!findUser)
      throw new HttpException('Usuario no encontrado', HttpStatus.FORBIDDEN);
    if (updateUsuario.password) {
      const hash = await bcrypt.hash(updateUsuario.password, 10);
      updateUsuario = { ...updateUsuario, password: hash };
    }
    return this.usuarioModel.findByIdAndUpdate(id, updateUsuario, {
      //new: true es para que cuando eliminemos o actualicemos nos devulva el objeto una ves ya modificado
      new: true,
    });
  }
  async delete(id: string) {
    const findUser = await this.usuarioModel.findById(id);
    if (!findUser)
      throw new HttpException('Usuario no encontrado', HttpStatus.FORBIDDEN);
    await this.tareaModel.deleteMany({ _id: { $in: findUser.tareas } });

    return this.usuarioModel.findByIdAndDelete(id);
  }
}
