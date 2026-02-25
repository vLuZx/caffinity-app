import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';
import { CreateUserDto } from '../dto/user.dto.create';
import { UserDto } from '../dto/user.dto.main';

@Injectable()
export class UserAuthService {
    private readonly saltRounds = 12;
    
    constructor(private readonly userRepository: UserRepository) {}

    async register(userData: CreateUserDto): Promise<UserDto> {
        const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);

        const userWithHashedPassword = new CreateUserDto(
            userData.username,
            userData.email,
            hashedPassword
        );

        return await this.userRepository.create(userWithHashedPassword);
    }

    async validateUser(emailOrUsername: string, password: string): Promise<UserDto | null> {
        let user = await this.userRepository.findByEmail(emailOrUsername);
        if (!user) {
            user = await this.userRepository.findByUsername(emailOrUsername);
        }

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return null;
        }

        return new UserDto(user.id, user.username, user.email);
    }
}
