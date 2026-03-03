import { Body, Controller, Post, Req, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import type { Request, Response } from "express";
import { Public } from "./decorators/public.decorator";
import { Throttle } from "@nestjs/throttler";

@Public()
@Throttle({ default: { ttl: 15 * 60_000, limit: 10 } })
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/register')
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true}))
	async createUser(@Body() registerUserDto: RegisterUserDto) {
		return this.authService.register(registerUserDto);
	}

	@Post('/login')
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true}))
	async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshToken } = await this.authService.login(loginDto.emailOrUsername, loginDto.password);
		const isProd = process.env.NODE_ENV === 'production';

		res.cookie('access_token', accessToken, {
			httpOnly: true,
			secure: isProd,
			maxAge: 15 * 60 * 1000,
			sameSite: 'lax'
		});
		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: 'lax',
			path: '/auth/refresh',
			maxAge: 1000 * 60 * 60 * 24 * 30, 
		});

		return { authenticated: true };
	}

	@Post('/logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('access_token');
		res.clearCookie('refresh_token', { path: '/auth/refresh' });
		return { authenticated: false };
	}

	@Public()
	@Post('/refresh')
	@Throttle({ default: { ttl: 60_000, limit: 10 } })
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const refreshToken = req.cookies?.refresh_token;

		if (!refreshToken) {
			return res.status(401).json({ message: 'Refresh token not found' });
		}

		const { accessToken } = await this.authService.refreshAccessToken(refreshToken);
		const isProd = process.env.NODE_ENV === 'production';

		// Set new access token
		res.cookie('access_token', accessToken, {
			httpOnly: true,
			secure: isProd,
			maxAge: 15 * 60 * 1000,
			sameSite: 'lax'
		});

		return { refreshed: true };
	}
}
