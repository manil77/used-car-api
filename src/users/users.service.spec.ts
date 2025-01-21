import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUserRepository: Partial<Repository<User>>;

  beforeEach(async () => {
    fakeUserRepository = {
      // Add mock methods as necessary, e.g.,
      find: jest.fn().mockResolvedValue([]),
      save: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: fakeUserRepository, // Mock implementation of UserRepository
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    //service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
