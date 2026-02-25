import { PrismaModule } from "../prisma/prisma.module";
import { UserController } from "./user.controller";
import { UserService } from "./service/user.service";
import { UserAuthService } from "./service/user.auth.service";
import { UserRepository } from "./user.repository";
import { Module } from "@nestjs/common";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserAuthService, UserRepository],
})
export class UserModule {}
