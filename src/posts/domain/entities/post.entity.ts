import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from '../../../tags/domain/entities/tag.entity';
import { Comment } from '../../../comments/domain/entities/comment.entity';
import { User } from '../../../users/domain/entities/user.entity';

@Entity({ name: 'posts' })
@Unique(['slug'])
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  authorId: number | null;

  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  @JoinColumn({ name: 'authorId' })
  author: User | null;

  @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({
    type: 'text',
    default: 'ACCEPTED',
  })
  status: 'DRAFT' | 'PENDING_REVIEW' | 'ACCEPTED' | 'REJECTED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

