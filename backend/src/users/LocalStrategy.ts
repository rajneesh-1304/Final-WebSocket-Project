import { Injectable, UnauthorizedException } from '@nestjs/common';
    import { PassportStrategy } from '@nestjs/passport';
    import { Strategy } from 'passport-local';
import { UserService } from './user.service';
    @Injectable()
    export class LocalStrategy extends PassportStrategy(Strategy) {
      constructor(private readonly userService: UserService) {
        super();
      }
      async validate(data): Promise<any> {
        const user = await this.userService.login(data);
        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
      }
    }