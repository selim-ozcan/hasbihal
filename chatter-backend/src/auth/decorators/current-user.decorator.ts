import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (value, context: ExecutionContext): User => {
    if (context.getType() === 'http')
      return context.switchToHttp().getRequest().user;
    if (context.getType() === 'ws')
      return context.switchToWs().getClient().user;
  },
);
