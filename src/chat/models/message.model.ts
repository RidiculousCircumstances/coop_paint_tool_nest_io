import { User } from '../../user/models/user.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Chat } from './chat.model';
import { Image } from './image.model';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.messages, { cascade: true })
  user: Promise<User>;

  @ManyToOne(() => Chat, (chat) => chat.messages, { cascade: true })
  chat: Promise<Chat>;

  @OneToMany(() => Image, (image) => image.message)
  images: Promise<Image[]>;

  @Column({
    length: 5000,
  })
  text: string;

  @Column({ nullable: true })
  referencedMessage?: number;

  @CreateDateColumn()
  createdAt: Date;
}
