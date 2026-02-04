import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { UserService } from './user.service';
import { UsersDefinition } from './DTO/user';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  registerUser(@Body() userData: UsersDefinition) {
    return this.userService.register(userData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.userService.getAll({ page, limit });
  }

}
