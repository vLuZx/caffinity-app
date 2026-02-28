import { IsEmail, IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class MainUserDto {

    @IsNotEmpty()
    @IsUUID("4")
    id: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(16)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    constructor(id: string, username: string, email: string) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}