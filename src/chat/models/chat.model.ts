import { User } from 'src/user/models/user.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Message } from './message.model';

@Entity()
@Unique(['chat_link'])
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_link: string;

  @ManyToMany(() => User, (user) => user.chats)
  users: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message;

  @CreateDateColumn()
  createdAt: Date;
}
