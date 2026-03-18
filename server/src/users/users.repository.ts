import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserData } from '../auth/dto/register.dto';
import { UserId } from '../common/types/branded.types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: UserId): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { id }
        });
    }

    async findIdByEmail(email: string): Promise<UserId | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });
        return user?.id as UserId ?? null;
    }

    async findIdByUsername(username: string): Promise<UserId | null> {
        const user = await this.prisma.user.findUnique({
            where: { username },
            select: { id: true }
        });
        return user?.id as UserId ?? null;
    }

    async findEmailById(id: UserId): Promise<string | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { email: true }
        });
        return user?.email ?? null;
    }

    async findUsernameById(id: UserId): Promise<string | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { username: true }
        });
        return user?.username ?? null;
    }

    async create(userData: CreateUserData): Promise<User> {
        return await this.prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                accountCreatedAt: new Date(),
                accountLastUpdatedAt: new Date(),
                refreshToken: userData.refreshToken ?? undefined,
                refreshTokenCreatedAt: userData.refreshToken ? new Date() : undefined,
                refreshTokenExpiresAt: userData.refreshTokenExpiresAt ?? undefined,
            }
        });
    }

    async updateRefreshToken(
        userId: UserId,
        hashedRefreshToken: string,
        expiresAt: Date
    ): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken: hashedRefreshToken,
                refreshTokenCreatedAt: new Date(),
                refreshTokenExpiresAt: expiresAt,
            }
        });
    }

    async clearRefreshToken(userId: UserId): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken: undefined,
                refreshTokenCreatedAt: undefined,
                refreshTokenExpiresAt: undefined,
            }
        });
    }

    async existsByEmail(email: string): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: { email }
        });
        return count > 0;
    }

    async existsByUsername(username: string): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: { username }
        });
        return count > 0;
    }

    async existsById(id: UserId): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: { id }
        });
        return count > 0;
    }
}