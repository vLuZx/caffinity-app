import { Controller, Get, Param, UseGuards, } from "@nestjs/common";
import { UsersService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt/jwt.guard";
import { SelfGuard } from "../auth/self.guard";

@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService, 
    ) {}

    @UseGuards(JwtAuthGuard, SelfGuard)
    @Get(":id")
    getUser(@Param("id") id: string) {
        return this.usersService.getUsernameByUserId(id);
    }
}