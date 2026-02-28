import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthenticatedUser } from "./auth.types";

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as AuthenticatedUser;
    const targetId = req.params.id as string;

    if (user.userId !== targetId) throw new ForbiddenException("Failed to access resource, user is not the owner!");
    return true;
  }
}