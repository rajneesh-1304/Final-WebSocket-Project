import { Controller, Get, Post, Req, UseGuards, Res, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(req.user, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getall')
  getall(@Req() req) {
    return {
      message: 'Access granted',
      user: req.user,
    };
  }

  @Post('logout')
  logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return this.authService.logout(req.body);
  }


}
