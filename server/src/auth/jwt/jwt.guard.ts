import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { TokenService } from './jwt.service';
import { UserId } from '../../common/types/branded.types';
import { UsersRepository } from '../../users/users.repository';
import { Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, 
		private usersRepository: UsersRepository,
		private tokenService: TokenService, 
		private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Check if route has isPublic metadata, assigned through @Public() decorator
		const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) return true;

		// Checks for authentication token
		const request = context.switchToHttp().getRequest();
		const accessToken = request.cookies?.access_token;
		const refreshToken = request.cookies?.refresh_token;
		console.log("Access token:", accessToken);
		console.log("Refresh token:", refreshToken);

		// Verifies authentication token, grants access if 
		// the token is valid, otherwise throws an error
		if(!accessToken && refreshToken) {
			return await this.handleTokenRefresh(request, 
				context.switchToHttp().getResponse(), 
				refreshToken);
		}
		else if (!accessToken && !refreshToken) {
			throw new UnauthorizedException("No refresh token or access token found.");
		}
		const payload = await this.jwtService.verifyAsync(accessToken);
		request.userId = payload.sub;
		return true;
	}

	private async handleTokenRefresh(
        request: Request,
        response: Response,
        refreshToken: string
    ): Promise<boolean> {
        try {
            const payload = await this.tokenService.verifyToken(refreshToken);
			console.log("Refresh token payload:", payload);

            if (payload.type !== 'refresh') {
                throw new UnauthorizedException("Invalid token type");
            }

            const userId = payload.sub as UserId;

            const user = await this.usersRepository.findById(userId);
            
            if (!user || !user.refreshToken) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            const isValidRefreshToken = await this.tokenService.verifyHashedToken(
                refreshToken,
                user.refreshToken
            );

            if (!isValidRefreshToken) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            if (user.refreshTokenExpiresAt && new Date() > user.refreshTokenExpiresAt) {
                throw new UnauthorizedException("Refresh token expired");
            }

            const newAccessToken = await this.tokenService.generateAccessToken(userId);
            const isProd = process.env.NODE_ENV === 'production';

            // Set new access token in cookie
            response.cookie('access_token', newAccessToken, {
                httpOnly: true,
                secure: isProd,
                maxAge: 15 * 60 * 1000,
                sameSite: 'lax'
            });

            request['userId'] = userId;

            return true;
        } catch (error) {
            response.clearCookie('access_token');
            response.clearCookie('refresh_token');
            throw new UnauthorizedException("Token refresh failed");
        }
    }
}