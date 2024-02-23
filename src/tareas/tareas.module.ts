import { Module } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { TareasResolver } from './tareas.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Tarea, TareaSchema } from './entities/tarea.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { Usuario, UsuarioSchema } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [
    UsuariosModule,
    MongooseModule.forFeature([
      {
        name: Tarea.name,
        schema: TareaSchema,
      },
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
    ]),
  ],
  providers: [TareasResolver, TareasService, AuthGuard],
})
export class TareasModule {}
