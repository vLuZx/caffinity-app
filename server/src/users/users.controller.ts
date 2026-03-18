import { Controller, Get, Req } from "@nestjs/common";
import type { Request } from "express";

type AuthenticatedRequest = Request & {
    userId?: string;
};

@Controller("users")
export class UsersController {

    @Get()
    async getId(@Req() req: AuthenticatedRequest) {
        return {
            userId: req.userId ?? null,
        };
    }
}
