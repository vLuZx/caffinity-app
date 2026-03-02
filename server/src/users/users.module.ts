import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersController } from "./users.controller";

@Module({
    imports: [PrismaModule],
    providers: [],
    controllers: [UsersController]
})
export class UsersModule {}