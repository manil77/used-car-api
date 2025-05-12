import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
    /* If request.session.userId is truthy value:-
     * User can access whatever route we've applied the guard to.
     * If request.session.userId is falsy value:-
     * Falsy value will prevent access to a given handler or controller
     */
  }
}
