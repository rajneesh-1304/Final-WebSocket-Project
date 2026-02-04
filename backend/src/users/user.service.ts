import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async register(data) {
    const userRepo = this.dataSource.getRepository(User);

    const existingUser = await userRepo.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const user = userRepo.create({
      displayName: data.displayName,
      email: data.email,
      password: data.password,
    });

    await userRepo.save(user);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
      },
    };
  }

  async login(data: { email: string }) {
    const userRepo = this.dataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if(user){
      return {
      message: 'User logged in successfully',
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
      },
    };
    }
    return null;
  }

  async getAll({
    page, limit
  }) {
    const userRepo = this.dataSource.getRepository(User);

    const [user, total] = await userRepo.createQueryBuilder('user').skip((page-1) * limit).take(limit).getManyAndCount();
    console.log(user);
    return {
      user: user,
      total,
      page, limit, hasMore: page* limit <total
    };
  }

  
}
