import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../users/users.repository";
import { RegisterUserDto } from "./dto/register.dto";
import { JwtPayload } from "./auth.types";
import { TokenService } from "./token.service";
import * as bcrypt from "bcrypt";
import { UserId } from "../common/types/branded.types";

@Injectable()
export class AuthService {
	private readonly saltRounds = 12;

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly tokenService: TokenService,
	) {}

	async register(userData: RegisterUserDto): Promise<UserId> {
		const existingEmail = await this.usersRepository.existsByEmail(userData.email.toLowerCase());
		if (existingEmail) {
			throw new ConflictException('Email already exists');
		}

		const existingUsername = await this.usersRepository.existsByUsername(userData.username.toLowerCase());
		if (existingUsername) {
			throw new ConflictException('Username already exists');
		}

		const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);

		// Generate refresh token data using TokenService
		const tempUserId = 'temp-' + Date.now(); // Temporary ID for token generation
		const refreshTokenData = await this.tokenService.generateRefreshTokenData(tempUserId);

		const user = await this.usersRepository.create({
			username: userData.username.toLowerCase(),
			email: userData.email.toLowerCase(),
			password: hashedPassword,
			refreshToken: refreshTokenData.hashedToken,
			refreshTokenExpiresAt: refreshTokenData.expiresAt,
		});

		// Regenerate tokens with actual user ID
		const actualRefreshTokenData = await this.tokenService.generateRefreshTokenData(user.id);
		
		// Update the user with correct refresh token
		await this.usersRepository.updateRefreshToken(
			user.id as UserId,
			actualRefreshTokenData.hashedToken,
			actualRefreshTokenData.expiresAt
		);

		return user.id as UserId;
	}

	async validateUser(emailOrUsername: string, password: string): Promise<UserId | null> {
		emailOrUsername = emailOrUsername.toLowerCase();

		let userId = await this.usersRepository.findIdByEmail(emailOrUsername);
		
		if (!userId) {
			userId = await this.usersRepository.findIdByUsername(emailOrUsername);
		}
		
		if (!userId) return null;

		const user = await this.usersRepository.findById(userId);
		if (!user) return null;

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) return null;

		return userId;
	}

	async login(emailOrUsername: string, password: string) {
		emailOrUsername = emailOrUsername.toLowerCase();

		const userId = await this.validateUser(emailOrUsername, password);
		if (!userId) throw new UnauthorizedException("Invalid credentials");

		const user = await this.usersRepository.findById(userId);
		if (!user) throw new UnauthorizedException("Invalid credentials");

		const tokenPair = await this.tokenService.generateTokenPair(userId);
		
		const hashedRefreshToken = await this.tokenService.hashToken(tokenPair.refreshToken);
		const refreshTokenExpiration = this.tokenService.getRefreshTokenExpiration();
		
		await this.usersRepository.updateRefreshToken(
			userId,
			hashedRefreshToken,
			refreshTokenExpiration
		);

		return { 
			accessToken: tokenPair.accessToken,
			refreshToken: tokenPair.refreshToken,
		};
	}

	async refreshAccessToken(refreshToken: string) {
		const payload = await this.tokenService.verifyToken(refreshToken);
		
		if (payload.type !== 'refresh') {
			throw new UnauthorizedException('Invalid token type');
		}

		const user = await this.usersRepository.findById(payload.userId as UserId);
		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		const isValid = await this.tokenService.verifyHashedToken(refreshToken, user.refreshToken!);
		if (!isValid) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		if (this.tokenService.isTokenExpired(user.refreshTokenExpiresAt!)) {
			throw new UnauthorizedException('Refresh token expired');
		}

		const accessToken = await this.tokenService.generateAccessToken(payload.userId);
		return { accessToken };
	}
}