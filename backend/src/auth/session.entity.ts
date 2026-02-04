import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=> User, user => user.sessions,{
    onDelete:'CASCADE'
  })
  @JoinTable({name: 'userId'})
  user: User;

  @Column()
  sessionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
