import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { bcrypt } from 'bcrypt';

export interface TokenPayload {
	sub: string;
	userId: string;
	type: 'access' | 'refresh';
}

export interface TokenPair {
	accessToken: string;
	refreshToken: string;
}

export interface RefreshTokenData {
	token: string;
	hashedToken: string;
	expiresAt: Date;
}

@Injectable()
export class TokenService {
	private readonly ACCESS_TOKEN_EXPIRY = '15m';
	private readonly REFRESH_TOKEN_EXPIRY = '30d';
	private readonly REFRESH_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

	constructor(
		private readonly jwtService: JwtService,
	) {}

	async generateTokenPair(userId: string): Promise<TokenPair> {
		const accessToken = await this.generateAccessToken(userId);
		const refreshToken = await this.generateRefreshToken(userId);

		return { accessToken, refreshToken };
	}

	async generateAccessToken(userId: string): Promise<string> {
		const payload: TokenPayload = {
			sub: userId,
			userId,
			type: 'access',
		};

		return this.jwtService.signAsync(payload, {
			expiresIn: this.ACCESS_TOKEN_EXPIRY,
		});
	}

	async generateRefreshToken(userId: string): Promise<string> {
		const payload: TokenPayload = {
			sub: userId,
			userId,
			type: 'refresh',
		};

		return this.jwtService.signAsync(payload, {
			expiresIn: this.REFRESH_TOKEN_EXPIRY,
		});
	}

	async generateRefreshTokenData(userId: string): Promise<RefreshTokenData> {
		const refreshToken = await this.generateRefreshToken(userId);
		const hashedToken = await this.hashToken(refreshToken);
		const expiresAt = new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY_MS);

		return {
			token: refreshToken,
			hashedToken,
			expiresAt,
		};
	}

	async hashToken(token: string): Promise<string> {
		const hashed = await bcrypt.hash(token, 12);
        return hashed;
	}

	async verifyToken(token: string): Promise<TokenPayload> {
		return this.jwtService.verifyAsync<TokenPayload>(token);
	}

	async verifyHashedToken(token: string, hashedToken: string): Promise<boolean> {
		const tokenHash = await this.hashToken(token);
		return tokenHash === hashedToken;
	}

	getRefreshTokenExpiration(): Date {
		return new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY_MS);
	}

	getRefreshTokenExpiryMs(): number {
		return this.REFRESH_TOKEN_EXPIRY_MS;
	}

	isTokenExpired(expiresAt: Date): boolean {
		return new Date() > expiresAt;
	}
}
