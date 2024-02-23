import { Test, TestingModule } from '@nestjs/testing';
import { TareasResolver } from './tareas.resolver';
import { TareasService } from './tareas.service';
import { Tarea } from './entities/tarea.entity';
import { Types } from 'mongoose';

describe('TareasResolver', () => {
  let resolver: TareasResolver;
  let service: TareasService;

  const mockTarea: Tarea = {
    _id: new Types.ObjectId('65cd07b02d095fffd10d259e'),
    nombre: 'tabled',
    descripcion: 'Test description',
    usuario: new Types.ObjectId('65cd07b02d095fffd10d259e'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TareasResolver,
        {
          provide: TareasService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TareasResolver>(TareasResolver);
    service = module.get<TareasService>(TareasService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('buscar una tarea', () => {
    it('deberia buscar todas las tareas', async () => {
      jest.spyOn(resolver, 'findAll').mockResolvedValue([mockTarea]);
      const result = await resolver.findAll();
      console.log(result);

      // expect(result).toEqual(createTareaDto);
    });
  });

  // describe('create', () => {
  //   it('deberia crear un usuario', async () => {
  //     const createTareaDto = {
  //       nombre: 'tabled',
  //       descripcion: 'Test description',
  //       usuarioId: '65cd07b02d095fffd10d259e',
  //     };
  //     jest.spyOn(service, 'create').mockResolvedValue(mockTarea);
  //     const result = await resolver.create(createTareaDto);
  //     console.log(result);
  //     expect(result).toEqual(createTareaDto);
  //   });
  // });
});
