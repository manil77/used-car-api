import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  
  beforeEach(async () => {
    fakeUserService = {
      findOne: (id:number) =>
        {return Promise.resolve({id:1, email:"some@some.com", password:"asdf"} as User) },
      find: (email:string) => 
        { return Promise.resolve([{id:1, email:"some@some.com", password:"asdf"} as User] )},
      // update: () =>{},
      // remove: () => {}
    };

    fakeAuthService = {
      // signup: () => {},
      // signIn: () => {}
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[
        {
          provide: UsersService,
          useValue: fakeUserService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
