import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Session } from './session.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class SessionService {
  constructor(private readonly dataSource: DataSource) {}

  async canLogin(userId: number) {
    const sessionRepo = this.dataSource.getRepository(Session);

    const existngSession = await sessionRepo.find({where: {user: {
      id:userId
    }}});
    if(existngSession.length > 2){
      return false;
    }
    return true;
  }

  async addSession(userId: number, sessionId) {
    const sessionRepo = this.dataSource.getRepository(Session);
    const userRepo =this.dataSource.getRepository(User);

    const user = await userRepo.findOne({where: {id:userId}});
    const totalSession = await sessionRepo.count({where: {user: {
      id:userId
    }}});

    if (totalSession >= 3) {
    throw new ForbiddenException("Session limit reached (Max 2)");
  }
    const sess = sessionRepo.create({
      sessionId:sessionId,
      user,
    })
    await sessionRepo.save(sess);

    return {message:"Session created successfully"};
  }

  async removeAllSession(userId) { 
    const sessionRepo = this.dataSource.getRepository(Session);
    const sessions = await sessionRepo.find({where : {user: {
      id:userId
    }}})
    await sessionRepo.remove(sessions);
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOne({where: {id: userId}});
    user.noOfLogin = 0;
    await userRepo.save(user);
    console.log('hello world');

  }

  async removeSession(userId: number, sessionId: string) {
    const sessionRepo = this.dataSource.getRepository(Session);

    await sessionRepo.delete({
      sessionId,
      user: { id: userId },
    });
  }

  async removeEarliestSession(email: string) {
  const sessionRepo = this.dataSource.getRepository(Session);
  const userRepo = this.dataSource.getRepository(User);

  const earliestSession = await sessionRepo.findOne({
    where: { user: { email } },
    order: { createdAt: 'ASC' },
  });

  if (!earliestSession) {
    return;
  }
  const sessionId=earliestSession.sessionId;

  await sessionRepo.remove(earliestSession);
  const user  = await userRepo.findOne({where: {email}});
  user.noOfLogin-=1;
  userRepo.save(user);

  const userId = user.id;

  console.log(
    `Removed earliest session: ${earliestSession.sessionId}`,
  );
  return {
    userId, sessionId
  }
}


}