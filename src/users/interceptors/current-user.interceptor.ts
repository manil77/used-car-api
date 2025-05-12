import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';

@Injectable() // We have to mark the class as Injectable to make use of dependency injection.
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  //context: Wrapper around incoming request
  //handler: That's a reference to the actual route handler that is going to run at some point in time
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
    }
    return handler.handle(); // handler.handle() means, just go ahead and run the acutal route handler
  }
}
