import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Message } from './message.model';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Message, (message) => message.images, { cascade: true })
  message: Promise<Message>;
}
