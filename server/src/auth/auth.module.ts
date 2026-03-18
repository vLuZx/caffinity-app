import { Module } from "@nestjs/common/decorators";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { StringValue } from "ms";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TokenService } from "./jwt/jwt.service";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersRepository } from "../users/users.repository";

@Module({
	imports: [
		ConfigModule,
		PrismaModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow<string>("JWT_SECRET"),
				signOptions: {
					expiresIn: (configService.get<string>("JWT_EXPIRATION") ?? "15m") as StringValue,
				},
			}),
		}),
	],
	providers: [AuthService, TokenService, UsersRepository],
	controllers: [AuthController],
	exports: [AuthService, TokenService, JwtModule, UsersRepository],
})
export class AuthModule {}