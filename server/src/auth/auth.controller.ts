import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/users.dto.create";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import type { Response } from "express";
import { Public } from "./decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";

@Public()
@Throttle({ default: { ttl: 15 * 60_000, limit: 10 } })
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
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken } = await this.authService.login(loginDto.emailOrUsername, loginDto.password);
        const isProd = process.env.NODE_ENV === 'production';

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: isProd,
            maxAge: 15 * 60 * 1000,
            sameSite: 'lax'
        });

        return { authenticated: true}
    }
}
