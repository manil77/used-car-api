import { Controller, Body, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        console.log(body);
    }

    @Get()
    findUser() { }


}
