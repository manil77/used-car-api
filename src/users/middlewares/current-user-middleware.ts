import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable() // We have to mark the class as Injectable to make use of dependency injection.
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}

  async use(req: any, res: any, next: () => void) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      req.currentUser = user; // Attach the current user to the request object
    }
    // Proceed to the next middleware or route handler
    next();
  }
}
