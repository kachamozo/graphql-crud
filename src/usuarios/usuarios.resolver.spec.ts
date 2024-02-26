import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('UsuariosResolver (e2e)', () => {
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
    it('Deberia devolver un array de usuarios', async () => {
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query ListaDeUsuarios {
            listaDeUsuarios {
              _id
              name
              email
              tareas {
                _id
                nombre
                descripcion
              }
            }
          }
          `,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.listaDeUsuarios).toBeInstanceOf(Array);
    });

    it('Deberia verificar que un objeto sea igual al objeto que le pasamos ', async () => {
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query ListaDeUsuarios {
            listaDeUsuarios {
              _id
              name
              email
              tareas {
                _id
                nombre
                descripcion
              }
            }
          }
          `,
        });
      expect(res.status).toBe(200);
      // toContainEqual verifica que en el array exista un objeto con las mismas propiedades
      expect(res.body.data.listaDeUsuarios).toContainEqual({
        _id: '65b011aabab9908e0ed861a2',
        email: 'marcos@marcos.com',
        name: 'marcos',
        tareas: [],
      });
    });

    it('Deberia verificar los tipos de datos', async () => {
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query ListaDeUsuarios {
            listaDeUsuarios {
              _id
              name
              email
              tareas {
                _id
                nombre
                descripcion
              }
            }
          }
          `,
        });
      expect(res.status).toBe(200);
      // toMatchObject verifica los tipos de datos de un objeto
      expect(res.body.data.listaDeUsuarios[0]).toMatchObject({
        _id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        tareas: expect.any(Array),
      });
    });
  });

  // FINDONEBYID busca una tarea por id
  describe('FIND ONE BY ID', () => {
    it('Deberia devolver un objeto de usuario', async () => {
      const id = '65b011aabab9908e0ed861a2';
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query BuscarUsuario {
            buscarUsuario(id: "65b011aabab9908e0ed861a2") {
              _id
              name
              email
              tareas {
                _id
                nombre
                descripcion
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
      expect(res.body.data.buscarUsuario).toBeInstanceOf(Object);
    });

    it('Deberia verificar que un objeto sea igual al objeto que le pasamos ', async () => {
      const res = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query BuscarUsuario {
            buscarUsuario(id: "65b011aabab9908e0ed861a2") {
              _id
              name
              email
              tareas {
                _id
                nombre
                descripcion
              }
            }
          }
          `,
        });
      expect(res.status).toBe(200);
      expect(res.body.data.buscarUsuario).toEqual({
        _id: '65b011aabab9908e0ed861a2',
      });
    });
  });
});
