import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { BadRequestException, NotFoundException } from '@nestjs/common';



//The describe block create an scope. It adds further description inside the tests written inside it
describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
    const users: User[] = [];

    beforeEach(async () => {
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter((user) => user.email);
                return Promise.resolve(filteredUsers);
            },

            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 999999),
                    email,
                    password,
                } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };
        const module = await Test.createTestingModule({
            providers: [ //we tried to create DI container.
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                },
            ],
        }).compile();

        service = module.get(AuthService);
    });


    //Referencing 'service' variable safely inside all of our different tests
    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    //New test cases
    it('should be able to create a new user', async () => {
        const user = await service.signup('some@some.com', 'asdf');

        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    //Check if the email is in use while signing up
    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () =>
            Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
            BadRequestException,
        );
    });

    //SignIn test case
    it('throws if signin is called with an unused email', async () => {
        await expect(
            service.signin('some@some.com', 'asdf'),
        ).rejects.toThrow(NotFoundException);
    });

    //Invalid password is provided
    it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () =>
            Promise.resolve([
                { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
            ]);
        await expect(
            service.signin('laskdjf@alskdfj.com', 'passowrd'),
        ).rejects.toThrow(BadRequestException);
    });

    //returns a user if password matches
    it('returns a user if password matches', async () => {
        fakeUsersService.find = () => Promise.resolve
            ([{ email: 'test2@some.com', password: 'Admin@123' } as User]);

        const user = await service.signin('test2@some.com', 'Admin@123');
        expect(user).toBeDefined();
    })


});
