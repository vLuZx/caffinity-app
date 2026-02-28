import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../users/user.repository";
import { CreateUserDto } from "../users/dto/user.dto.create";
import { JwtPayload } from "./auth.types";
import * as bcrypt from "bcrypt";
import { DefaultRoles } from "../roles/roles.types";
import { UserId } from "../common/types/branded.types";

@Injectable()
export class AuthService {
  	private readonly saltRounds = 12;

  	constructor(
    	private readonly usersRepository: UsersRepository,
    	private readonly jwtService: JwtService,
  	) {}

  	async register(userData: CreateUserDto): Promise<UserId> {
        const existingEmail = await this.usersRepository.existsByEmail(userData.email);
        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        const existingUsername = await this.usersRepository.existsByUsername(userData.username);
        if (existingUsername) {
            throw new ConflictException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);

        const user = await this.usersRepository.create({
            username: userData.username,
            email: userData.email,
            password: hashedPassword
        });

        return user.id as UserId;
  	}

  	async validateUser(emailOrUsername: string, password: string): Promise<UserId | null> {
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
		const userId = await this.validateUser(emailOrUsername, password);
		if (!userId) throw new UnauthorizedException("Invalid credentials");

		const user = await this.usersRepository.findById(userId);
		if (!user) throw new UnauthorizedException("Invalid credentials");

		const payload: JwtPayload = { sub: userId, role: DefaultRoles.User };
		const accessToken = await this.jwtService.signAsync(payload);

		return { 
			accessToken,
			user: {
				id: user.id,
				username: user.username,
				email: user.email
			}
		};
	}
}