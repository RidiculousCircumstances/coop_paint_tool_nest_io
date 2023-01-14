import {
  ArgumentsHost,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
