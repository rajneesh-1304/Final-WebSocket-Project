import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return null;
    }

    if(user.noOfLogin === 2){
      throw new ForbiddenException("No of Login exceeded 2");
    }
    if(user.noOfLogin === 1){
      user.noOfLogin = 2;
      await userRepo.save(user);
    }
    if(user.noOfLogin === 0){
      user.noOfLogin = 1;
      await userRepo.save(user);
    }

    return user;
  }

  signIn(user: User, res) {
  const payload = { sub: user.id, email: user.email };
  const token = this.jwtService.sign(payload);

  res.cookie('access_token', token, {
    httpOnly: true,
    maxAge: 600000, 
    sameSite: 'lax',
    secure: false, 
  });

  return {
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      token:token,
    },
  };
}

async logout(user){
  const userRepo = this.dataSource.getRepository(User);
  const existingUser = await userRepo.findOne({where: {email : user.email}});
  if(!existingUser){
    throw new NotFoundException("User not found");
  }

  if(existingUser && existingUser.noOfLogin === 1){
    existingUser.noOfLogin=0;
    await userRepo.save(existingUser);
  }

  if(existingUser && existingUser.noOfLogin === 2){
    existingUser.noOfLogin=1;
    await userRepo.save(existingUser);
  }

  return {message:"Logout successfully"}
}

}
