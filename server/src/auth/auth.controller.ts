import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/user.dto.create";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true}))
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('/login')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true}))
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.emailOrUsername, loginDto.password);
    }
}
