import { PrismaClient, User } from '../../generated/prisma';
import { UserDto } from './dto/user.dto.main';
import { CreateUserDto } from './dto/user.dto.create';
const prisma = new PrismaClient();

export class UserRepository {
    async findById(id: string): Promise<UserDto | null> {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
            }
        });
        return user ? new UserDto(user.id, user.username, user.email) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async findByUsername(username: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { username }
        });
    }

    async create(userData: CreateUserDto): Promise<UserDto> {
        const user = await prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                password: userData.password 
            },
            select: {
                id: true,
                username: true,
                email: true,
            }
        });
        return new UserDto(user.id, user.username, user.email);
    }
}