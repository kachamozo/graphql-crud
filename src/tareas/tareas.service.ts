import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tarea } from './entities/tarea.entity';
import { Model } from 'mongoose';
import { BuscarTareaDto } from './dto/buacar-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class TareasService {
  constructor(
    @InjectModel(Tarea.name) private tareaModel: Model<Tarea>,
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async create(createTarea: CreateTareaDto): Promise<Tarea> {
    // Buscar al usuario
    const usuario = await this.usuarioModel.findById(createTarea.usuarioId);

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
  findById(busqueda: BuscarTareaDto): Promise<Tarea> {
    return this.tareaModel
      .findById(busqueda._id)
      .populate('usuario', 'email name')
      .exec();
  }

  //Cuando se usa un dto como buscar tarea dto siempre es un objeto, nunca colocar busqueda._id
  async update(busqueda: BuscarTareaDto, updateTarea: UpdateTareaDto) {
    const findTarea = await this.tareaModel.findById(busqueda).exec();

    if (!findTarea)
      throw new HttpException('Tarea no encontrada', HttpStatus.FORBIDDEN);

    return this.tareaModel.findByIdAndUpdate(busqueda, updateTarea, {
      new: true,
    });
  }

  //: Promise<Tarea> me da error talves sea que al eliminar ya no se puede leer los datos la verdad no se
  async delete(busqueda: BuscarTareaDto) {
    const data = await this.tareaModel.findByIdAndDelete(busqueda._id);
    if (!data)
      throw new HttpException('Error al borrar la tarea', HttpStatus.FORBIDDEN);
    return 'Eliminado exitosamente';
  }
}
