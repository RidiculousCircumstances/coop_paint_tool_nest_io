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
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.messages, { cascade: true })
  chat: Chat;

  @Column()
  text: string;

  @Column({ nullable: true })
  referencedMessage: string;

  @Column()
  image: string;

  @CreateDateColumn()
  createdAt: Date;
}
