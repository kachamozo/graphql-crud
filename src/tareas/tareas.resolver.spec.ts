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

  // DESCRIBE BASE GENERAL
  describe('GET ALL', () => {
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
        .expect((res) => console.log(res.body.data.listaDeTareas));
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
        .expect(400);
    });
  });
  // it('GETALL TAREAS', () => {
  //   const token: string = ''

  //   it('login', () => {
  //     expect(app).toBeDefined();
  //   });
  // });
});
