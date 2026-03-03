import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Check if route has isPublic metadata, assigned through @Public() decorator
		const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) return true;

		// Checks for authentication token
		const request = context.switchToHttp().getRequest();
		const token = request.cookies?.access_token;
		
		// Verifies authentication token, grants access if 
		// the token is valid, otherwise throws an error
		const payload = await this.jwtService.verifyAsync(token);
		request.userId = payload.userId;
		return true;
	}
}