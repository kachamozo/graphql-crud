import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('TareasResolver (e2e)', () => {
  let app: INestApplication;
  const gql = '/graphql';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('debe estar definido', () => {
    expect(app).toBeDefined();
  });

  // FINDALL busca todas las tareas
  describe('FIND ALL', () => {
    let token: string = '';

    // FUNCION 1
    it('login', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation LoginUsuario($loginUser: LoginDto!) {
            loginUsuario(loginUser: $loginUser) {
          token    
            }
          }
          `,
          variables: {
            loginUser: {
              email: 'juan@juan.com',
              password: 'Juan123',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          console.log(res.body.data.loginUsuario);
          token = res.body.data.loginUsuario.token;
        });
    });

    // FUNCION 2
    it('tareas getAll', () => {
      return request(app.getHttpServer())
        .post(gql)
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
          query ListaDeTareas {
            listaDeTareas {
              _id
              nombre
            }
          }
          `,
          // variables: {},
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.listaDeTareas).toBeInstanceOf(Array);
        });
    });

    // FUNCION 3
    it('espero un INAUTHIORZADO', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query ListaDeTareas {
            listaDeTareas {
              _id
              nombre
            }
          }
          `,
          // variables: {},
        })
        .expect(200)
        .expect((res) => {
          console.log(res.body.errors[0].message);
          expect(res.body.errors[0].message).toBe('Unauthorized');
        });
    });
  });

  // FINDBYID busca por id
  describe('FIND BY ID', () => {
    it('debe retornar una tarea', async () => {
      const id = '65d8a07af6892e431ff0499e';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query BuscarTarea($busqueda: BuscarTareaDto!) {
            buscarTarea(busqueda: $busqueda) {
              _id
              nombre
              usuario{
                _id
                email
              }
            }
          }
          `,
          variables: {
            busqueda: {
              _id: id,
            },
          },
        });
      expect(res.status).toBe(200);
      expect(res.body.data.buscarTarea).toHaveProperty('_id');
      expect(res.body.data.buscarTarea).toHaveProperty('nombre');
    });

    it('debe retornar mensaje de error Id invalido', async () => {
      const id = '65d8a07af689';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query BuscarTarea($busqueda: BuscarTareaDto!) {
            buscarTarea(busqueda: $busqueda) {
              _id
              nombre
              usuario{
                _id
                email
              }
            }
          }
          `,
          variables: {
            busqueda: {
              _id: id,
            },
          },
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toBe('ID inválido');
    });
    it('debe retornar tarea no encontrada', async () => {
      const id = '65d8a07af6892e431ff04997';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query BuscarTarea($busqueda: BuscarTareaDto!) {
            buscarTarea(busqueda: $busqueda) {
              _id
              nombre
              usuario{
                _id
                email
              }
            }
          }
          `,
          variables: {
            busqueda: {
              _id: id,
            },
          },
        });
      expect(res.status).toBe(404);
      expect(res.body.errors[0].message).toBe('Tarea no encontrada');
    });
  });

  // CREATE crea una tarea
  describe('CREATE', () => {
    // it('debe crear una tarea', async () => {
    //   const id = '65b013c8410c84fa57c15bd1';
    //   const res = await request(app.getHttpServer())
    //     .post(gql)
    //     .send({
    //       query: `
    //       mutation CrearTarea($data: CreateTareaDto!) {
    //         crearTarea(data: $data) {
    //           _id
    //           nombre
    //           usuario{
    //             _id
    //           }
    //         }
    //       }
    //       `,
    //       variables: {
    //         data: {
    //           nombre: 'Tarea 1',
    //           descripcion: 'Descripcion de la tarea 1',
    //           usuarioId: id,
    //         },
    //       },
    //     });
    //   expect(res.status).toBe(200);
    //   expect(res.body.data.crearTarea).toHaveProperty('_id');
    //   expect(res.body.data.crearTarea).toHaveProperty('usuario');
    // });
    it('debe retornar ID invalido', async () => {
      const id = '123456';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation CrearTarea($data: CreateTareaDto!) {
            crearTarea(data: $data) {
              _id
              nombre
              usuario{
                _id
              }
            }
          }
          `,
          variables: {
            data: {
              nombre: 'Tarea 1',
              descripcion: 'Descripcion de la tarea 1',
              usuarioId: id,
            },
          },
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toBe('ID inválido');
    });
    it('debe retornar Usuario no encontrado', async () => {
      const id = '65d8a07af6892e431ff0499e';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation CrearTarea($data: CreateTareaDto!) {
            crearTarea(data: $data) {
              _id
              nombre
              usuario{
                _id
              }
            }
          }
          `,
          variables: {
            data: {
              nombre: 'Tarea 1',
              descripcion: 'Descripcion de la tarea 1',
              usuarioId: id,
            },
          },
        });
      expect(res.status).toBe(404);
      expect(res.body.errors[0].message).toBe('Usuario no encontrado');
    });
  });

  // UPDATE actualiza una tarea
  describe('UPDATE', () => {
    it('debe actualizar una tarea', async () => {
      const id = '65dca8d85104f30995a78ea8';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation UpdateTarea($busqueda: BuscarTareaDto!, $data: UpdateTareaDto!) {
            updateTarea(busqueda: $busqueda, data: $data) {
              _id
              nombre
              descripcion
              usuario{
                _id
              }
            }
          }
          `,
          variables: {
            busqueda: {
              _id: id,
            },
            data: {
              nombre: 'Tarea 20',
              descripcion: 'Descripcion de la tarea 20',
            },
          },
        });
      expect(res.status).toBe(200);
      expect(res.body.data.updateTarea).toHaveProperty('_id');
    });
    it('debe retornar ID invalido', async () => {
      const id = '123456';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation UpdateTarea($busqueda: BuscarTareaDto!, $data: UpdateTareaDto!) {
            updateTarea(busqueda: $busqueda, data: $data) {
              _id
              nombre
              descripcion
              usuario{
                _id
              }
            }
          }
          `,
          variables: {
            busqueda: {
              _id: id,
            },
            data: {
              nombre: 'Tarea 20',
              descripcion: 'Descripcion de la tarea 20',
            },
          },
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toBe('ID inválido');
    });

    it('debe retornar Tarea no encontrada', async () => {
      const id = '65dca8ca5104f30995a78ea0';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation UpdateTarea($busqueda: BuscarTareaDto!, $data: UpdateTareaDto!) {
            updateTarea(busqueda: $busqueda, data: $data) {
              _id
              nombre
              descripcion
              usuario{
                _id
              }
            }
          }
          `,
          variables: {
            busqueda: {
              _id: id,
            },
            data: {
              nombre: 'Tarea 20',
              descripcion: 'Descripcion de la tarea 20',
            },
          },
        });
      expect(res.status).toBe(404);
      expect(res.body.errors[0].message).toBe('Tarea no encontrada');
    });
  });

  // DELETE elimina una tarea
  describe('DELETE', () => {
    // it('debe eliminar una tarea', async () => {
    //   const id = '65dca87a5104f30995a78e9e';
    //   const res = await request(app.getHttpServer())
    //     .post(gql)
    //     .send({
    //       query: `
    //       mutation EliminarTarea($busqueda: BuscarTareaDto!) {
    //         eliminarTarea(busqueda: $busqueda)
    //       }
    //       `,
    //       variables: {
    //         busqueda: {
    //           _id: id,
    //         },
    //       },
    //     });
    //   expect(res.status).toBe(200);
    //   expect(res.body.data.eliminarTarea).toBe('Tarea eliminada exitosamente');
    // });
    it('debe retornar ID invalido', async () => {
      const id = '123456';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation EliminarTarea($busqueda: BuscarTareaDto!) {
            eliminarTarea(busqueda: $busqueda)
          }
          `,
          variables: {
            busqueda: {
              _id: id,
            },
          },
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toBe('ID inválido');
    });

    it('debe retornar Tarea no encontrada', async () => {
      const id = '65dca8ca5104f30995a78ea0';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation EliminarTarea($busqueda: BuscarTareaDto!) {
            eliminarTarea(busqueda: $busqueda)
          }
          `,
          variables: {
            busqueda: {
              _id: id,
            },
          },
        });
      expect(res.status).toBe(404);
      expect(res.body.errors[0].message).toBe('Tarea no encontrada');
    });
  });
});
