import { DefaultRoles } from "../roles/roles.types";

export type JwtPayload = {
    sub: string;
    role: DefaultRoles;
};

export type AuthenticatedUser = {
    userId: string;
    role: DefaultRoles;
};