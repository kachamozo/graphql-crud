import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';

import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Resolver(() => Usuario)
export class UsuariosResolver {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Query(() => [Usuario], { name: 'listaDeUsuarios' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Query(() => Usuario, { name: 'buscarUsuario' })
  findOneById(
    @Args('id', { type: () => String })
    id: string,
  ) {
    return this.usuariosService.findOneById(id);
  }

  @Mutation(() => Usuario, { name: 'actualizarUsuario' })
  updateUsuario(
    @Args('id') id: string,
    @Args('dataUpdate') updateUsuario: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuario);
  }

  @Mutation(() => Usuario, { name: 'removerUsuario' })
  removeUsuario(@Args('id', { type: () => String }) id: string) {
    return this.usuariosService.delete(id);
  }
}
