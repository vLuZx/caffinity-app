import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import express from 'express';
import { TimeoutInterceptor } from './timeout.interceptor';
import helmet from "helmet";
import csurf from 'csurf';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	app.use(helmet());

	app.use(express.json({ limit: '1mb' }));

	app.use(cookieParser());

	app.use(csurf({
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        }
    }));

    app.use((req, res, next) => {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {
            httpOnly: false,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
        next();
    });

	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true,
		transform: true,
	}));

	app.useGlobalInterceptors(new TimeoutInterceptor(15_000));

	app.enableCors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		credentials: true,
	});
	
	const port = process.env.PORT || 3001;
	const server = await app.listen(port);
	server.requestTimeout = 15_000;
	server.keepAliveTimeout = 3_000;
	server.headersTimeout = 5_000;
	console.log(`Server running on http://localhost:${port}`);
	
}
bootstrap();
