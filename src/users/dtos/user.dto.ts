import { IsEmail, IsNumber } from "class-validator";
import { Expose, Exclude } from "class-transformer";

export class UserDto {

    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @IsEmail()
    email: string;
}