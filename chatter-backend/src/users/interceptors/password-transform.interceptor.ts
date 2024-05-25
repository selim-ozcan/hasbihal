import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {} from 'class-transformer';
import { Observable, map } from 'rxjs';
import { User } from '../entities/user.entity';

@Injectable()
export class PasswordTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: User | User[]) => {
        if (Array.isArray(data)) {
          data.forEach((user) => delete user.password);
        } else {
          delete data.password;
        }

        return data;
      }),
    );
  }
}
