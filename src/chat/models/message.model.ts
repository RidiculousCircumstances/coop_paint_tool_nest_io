import { User } from '../../user/models/user.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Chat } from './chat.model';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.messages, { cascade: true })
  user: Promise<User>;

  @ManyToOne(() => Chat, (chat) => chat.messages, { cascade: true })
  chat: Promise<Chat>;

  @Column()
  text: string;

  @Column({ nullable: true })
  referencedMessage?: number;

  @Column({ nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;
}
