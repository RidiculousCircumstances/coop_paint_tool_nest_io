import { Chat } from '../../chat/models/chat.model';
import { Message } from '../../chat/models/message.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  JoinTable,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
  })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 500,
  })
  password: string;

  @ManyToMany(() => Chat, (chat) => chat.users, { cascade: true })
  @JoinTable({
    name: 'chats_users',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'chat_id',
      referencedColumnName: 'id',
    },
  })
  chats: Promise<Chat[]>;

  @OneToMany(() => Chat, (chat) => chat.creator)
  created_chats: Promise<Chat[]>;

  @OneToMany(() => Message, (message) => message.user)
  messages: Promise<Message[]>;

  @CreateDateColumn()
  createdAt: Date;
}
