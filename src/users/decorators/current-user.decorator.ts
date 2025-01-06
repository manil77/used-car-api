import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => { //ExecutionContext is an abstract from of communication protocal that is being used. For example, HTTP or gRPC or GraphQL
        const request = context.switchToHttp().getRequest();
        //console.log(request.currentUser);
        return request.currentUser;
    });