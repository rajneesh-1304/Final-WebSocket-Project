import { Module, Controller, Get } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards';
import {Session} from './auth/session.entity';
@Controller()
class AppController {
  @Get()
  root() {
    return { message: 'NestJS Todo Backend is running!' };
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'cookie',
      entities: [
        User, Session
      ],
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    }),
    UserModule,
    AuthModule,
  ],
  // providers: [
  //   { provide: APP_GUARD, useClass: AuthGuard }
  // ],
  controllers: [AppController],
})
export class AppModule {}