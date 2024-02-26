import { Injectable } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tarea } from './entities/tarea.entity';
import { Model, Types } from 'mongoose';
import { BuscarTareaDto } from './dto/buacar-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { GraphQLError } from 'graphql';

@Injectable()
export class TareasService {
  constructor(
    @InjectModel(Tarea.name) private tareaModel: Model<Tarea>,
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async create(createTarea: CreateTareaDto): Promise<Tarea> {
    //verificamos que el id que nos pasan sea valido
    if (!Types.ObjectId.isValid(createTarea.usuarioId)) {
      throw new GraphQLError('ID inválido', {
        extensions: { http: { status: 400 } },
      });
    }
    // Buscar al usuario
    const usuario = await this.usuarioModel.findById(createTarea.usuarioId);

    if (!usuario)
      throw new GraphQLError('Usuario no encontrado', {
        extensions: { http: { status: 404 } },
      });

    // Crear la tarea
    const tarea = new this.tareaModel({
      ...createTarea,
      usuario: usuario._id,
    });

    // Guardar la tarea y el usuario actualizado
    const savedTarea = await tarea.save();
    usuario.tareas.push(savedTarea._id);
    await usuario.save();

    return savedTarea;
  }

  findAll(): Promise<Tarea[]> {
    return this.tareaModel.find().populate('usuario', 'email name').exec();
  }
  async findById(busqueda: BuscarTareaDto): Promise<Tarea> {
    if (!Types.ObjectId.isValid(busqueda._id)) {
      throw new GraphQLError('ID inválido', {
        extensions: { http: { status: 400 } },
      });
    }
    const tarea = await this.tareaModel
      .findById(busqueda)
      .populate('usuario', 'email name ');

    if (!tarea)
      throw new GraphQLError('Tarea no encontrada', {
        extensions: { http: { status: 404 } },
      });

    return tarea;
  }

  //Cuando se usa un dto como buscar tarea dto siempre es un objeto, nunca colocar busqueda._id
  async update(busqueda: BuscarTareaDto, updateTarea: UpdateTareaDto) {
    if (!Types.ObjectId.isValid(busqueda._id)) {
      throw new GraphQLError('ID inválido', {
        extensions: { http: { status: 400 } },
      });
    }
    const findTarea = await this.tareaModel.findById(busqueda).exec();

    if (!findTarea)
      throw new GraphQLError('Tarea no encontrada', {
        extensions: { http: { status: 404 } },
      });

    return this.tareaModel.findByIdAndUpdate(busqueda, updateTarea, {
      new: true,
    });
  }

  //: Promise<Tarea> me da error talves sea que al eliminar ya no se puede leer los datos la verdad no se
  async delete(busqueda: BuscarTareaDto) {
    if (!Types.ObjectId.isValid(busqueda._id)) {
      throw new GraphQLError('ID inválido', {
        extensions: { http: { status: 400 } },
      });
    }
    const data = await this.tareaModel.findByIdAndDelete(busqueda).exec();
    if (!data)
      throw new GraphQLError('Tarea no encontrada', {
        extensions: { http: { status: 404 } },
      });
    return 'Tarea eliminada exitosamente';
  }
}
