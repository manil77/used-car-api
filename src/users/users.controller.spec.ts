import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

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
          provide:UsersService,
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

  it('findAllUser returns a list of users with the given email', async () =>{
    const users=  await controller.findAll('some@some.com');
    expect(users.length).toEqual(1),
    expect(users[0].email).toEqual('some@some.com');
  })

  it('findUser returns a single user with the given id', async ()=>{
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });
});
