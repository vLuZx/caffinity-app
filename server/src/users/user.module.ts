import { PrismaModule } from "../prisma/prisma.module";
import { UsersController } from "./user.controller";
import { UsersService } from "./user.service";
import { UsersRepository } from "./user.repository";
import { Module } from "@nestjs/common";

@Module({
    imports: [PrismaModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
})
export class UsersModule {}
