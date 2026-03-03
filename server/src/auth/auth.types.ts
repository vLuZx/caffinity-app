import { UserId } from "../common/types/branded.types";

export type JwtPayload = {
	sub: string;
};

export type AuthenticatedUser = {
	userId: UserId;
};