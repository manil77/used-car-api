import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { UsersService } from "./users.service"
import { randomBytes, scrypt as _scrpyt } from "crypto";
import { promisify } from "util"; //It is a function that makes use of callbacks. We are using promisify to work with scrypt

const scrypt = promisify(_scrpyt); //Promise based version of script as a variable called scrypt

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        //See if email is in use
        const users = await this.usersService.find(email);

        if (users.length) {
            throw new BadRequestException('User already exists');
        }

        //Hash the users password

        //Generate a salt
        /**
         * randomBytes returns a Buffer, which is similar to an array.
         * It has raw binary data inside 1's and 0's.
         */
        const salt = randomBytes(8).toString('hex'); //16 characters of string 1 bytes = 2 character. That is 8*2 = 16

        //Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer; //32 means, its gives us 32 characters back

        //Join the hashed result and the salt together
        const hashedResult = salt + '.' + hash.toString('hex');

        // Create  a new user and save it
        const newUser = await this.usersService.create(email, hashedResult);
        //return the user
        return newUser;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (hash.toString('hex') !== storedHash) {
            throw new BadRequestException('Credentials is not correct');
        }
        else {
            return user;
        }
    }
}