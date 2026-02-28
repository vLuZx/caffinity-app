import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    emailOrUsername: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    constructor(emailOrUsername: string, password: string) {
        this.emailOrUsername = emailOrUsername;
        this.password = password;
    }
}
