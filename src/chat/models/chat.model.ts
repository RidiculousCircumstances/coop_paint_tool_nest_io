import { User } from '../../user/models/user.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Message } from './message.model';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({
  //   type: 'varchar',
  //   length: 100,
  // })
  // chat_link: string;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.chats)
  users: Promise<User[]>;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Promise<Message[]>;

  @ManyToOne(() => User, (user) => user.chats)
  creator: Promise<User>;

  @CreateDateColumn()
  createdAt: Date;
}
