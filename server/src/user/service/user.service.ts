import { Injectable } from "@nestjs/common";
import { UserDto } from "../dto/user.dto.main";
import { UserRepository } from "../user.repository";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getUserMain(id: string): Promise<UserDto | null> {
        return await this.userRepository.findById(id);
    }
}