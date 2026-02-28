import { Module } from "@nestjs/common/decorators";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { UsersModule } from "../users/user.module";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersRepository } from "../users/user.repository";

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        PrismaModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
                signOptions: { expiresIn: '7d' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, UsersRepository],
    exports: [AuthService],
})
export class AuthModule {}