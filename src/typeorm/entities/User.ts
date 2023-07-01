import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Profile } from './Profile';
import { Post } from './Posts';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' }) 
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ nullable: true })
    authStrategy: string;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];
}