import { IsLowercase, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @IsLowercase()
    emailOrUsername: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    constructor(emailOrUsername: string, password: string) {
        this.emailOrUsername = emailOrUsername?.toLowerCase();
        this.password = password;
    }
}
