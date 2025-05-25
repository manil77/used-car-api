import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    //ExecutionContext is a wrapper around the incoming request
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      return false;
    }
    if (!request.currentUser.admin) {
      return false;
    }
    return request.currentUser.admin;
  }
}
