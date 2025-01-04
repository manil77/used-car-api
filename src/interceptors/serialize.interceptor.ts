import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { UserDto } from "src/users/dtos/user.dto";

export class SerializeInterceptors implements NestInterceptor {
    /**
     *
     */
    constructor(private dto: any) {

    }
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dto, data, {
                    /*excludeExtraneousValues is only going to share
                    or expose the different properties that are 
                    specifically marked with Expose() decorator*/
                    excludeExtraneousValues: true
                })
            })
        )
    }
}