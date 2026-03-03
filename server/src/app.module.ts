import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt/jwt.guard';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { LoggerModule } from 'nestjs-pino'

@Module({
	imports: [
		LoggerModule.forRoot({
		pinoHttp: {
			level: process.env.LOG_LEVEL ?? 'info',
			genReqId: (req) => req.headers['x-request-id'] ?? crypto.randomUUID(),
			base: {
				service: 'api',
				env: process.env.NODE_ENV ?? 'dev',
				version: process.env.APP_VERSION ?? 'dev',
			},
			redact: { paths: ['req.headers.authorization', 'req.headers.cookie'], remove: true },
			serializers: {
				req(req) {
					return { id: req.id, method: req.method, url: req.url }
				},
				res(res) {
					return { statusCode: res.statusCode };
				},
			}
		}
		}),
		ThrottlerModule.forRoot([
		{
			name: 'default',
			ttl: 60_000,
			limit: 50,
		},
		]),
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '../.env',
		}),
		PrismaModule,
		AuthModule,
		UsersModule,
	],
	controllers: [],
	providers: [
		{ provide: APP_GUARD, useClass: ThrottlerGuard },
		{ provide: APP_GUARD, useClass: JwtAuthGuard }
	],
})
export class AppModule {}
