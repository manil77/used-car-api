import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserMiddleware } from './middlewares/current-user-middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //This import makes the repository for us
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    // {
    //   //This is how we make the interceptors global
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor,
    // },
  ],
})
export class UsersModule {
  //This is how we apply the middleware globally
  configure(consumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*'); // Apply to all routes
  }
}
