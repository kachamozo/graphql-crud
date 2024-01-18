import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TareasService } from './tareas.service';
import { Tarea } from './entities/tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { BuscarTareaDto } from './dto/buacar-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Tarea)
export class TareasResolver {
  constructor(private readonly tareasService: TareasService) {}

  @Mutation(() => Tarea, { name: 'crearTarea' })
  create(
    @Args('data')
    createTarea: CreateTareaDto,
  ) {
    return this.tareasService.create(createTarea);
  }

  @Query(() => [Tarea], { name: 'listaDeTareas' })
  findAll() {
    return this.tareasService.findAll();
  }

  @Query(() => Tarea)
  @UseGuards(AuthGuard)
  findById(@Args('busqueda') busqueda: BuscarTareaDto) {
    return this.tareasService.findById(busqueda);
  }
  @Mutation(() => Tarea, { name: 'updateTarea' })
  update(
    @Args('busqueda') busqueda: BuscarTareaDto,
    @Args('data') updateTarea: UpdateTareaDto,
  ) {
    return this.tareasService.update(busqueda, updateTarea);
  }

  @Mutation(() => String, { name: 'eliminarTarea' })
  delete(@Args('busqueda') busqueda: BuscarTareaDto) {
    return this.tareasService.delete(busqueda);
  }
}
