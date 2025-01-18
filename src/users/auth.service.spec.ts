import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { BadRequestException } from '@nestjs/common';



//The describe block create an scope. It adds further description inside the tests written inside it
describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
    beforeEach(async () => {
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
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

});
