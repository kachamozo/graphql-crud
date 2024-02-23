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
  it('tareas getAll', () => {
    // IT FUNCION1
    // LOGIN

    // IT FUNCION2
    // LISTARTAREAS

    // IT FUNCION3
    // INAUTIRAZADO
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5AanVhbi5jb20iLCJpYXQiOjE3MDg3MTUxNjYsImV4cCI6MTcwODcxNTc2Nn0.SSI3SLZu5gl3xr4O0crBM1YlVOgzQPxHHfnOQ0gykWE';
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
  // it('')
});
