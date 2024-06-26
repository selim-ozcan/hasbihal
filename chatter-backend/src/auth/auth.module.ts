import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { WsJwtStrategy } from './strategies/ws-jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('JWT_SECRET'),
          signOptions: {
            expiresIn: Number(configService.getOrThrow('JWT_EXPIRATION')),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, WsJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
