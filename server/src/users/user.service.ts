import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./user.repository";
import { toUserId, UserId } from "../common/types/branded.types";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async getUsernameByUserId(userIdString: string): Promise<string> {
        let userId: UserId;
        try {
            userId = toUserId(userIdString);
        } catch (error) {
            throw new BadRequestException('Invalid user ID format');
        }

        const username = await this.usersRepository.findUsernameById(userId);
        
        if (!username) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        return username;
    }
}