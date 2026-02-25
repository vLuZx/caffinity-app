import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./service/user.service";
import { UserDto } from "./dto/user.dto.main";
import { CreateUserDto } from "./dto/user.dto.create";
import { UserAuthService } from "./service/user.auth.service";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService, 
        private readonly userAuthService: UserAuthService,
    ) {}

    @Get(':id')
    async getUser(@Param('id') id: string): Promise<UserDto | null> {
        return await this.userService.getUserMain(id);
    }

    @Post('register')
    @UsePipes(ValidationPipe)
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        return await this.userAuthService.register(createUserDto);
    }
}