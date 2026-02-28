import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(16)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    })
    password: string;

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
