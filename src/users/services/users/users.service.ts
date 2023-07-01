import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm/entities/User';
import { CreateUserParams, UpdateUserParams, CreateProfileUserParams, CreateUserPostParams } from 'src/utils/types';
import { Profile } from 'src/typeorm/entities/Profile';
import { Post } from 'src/typeorm/entities/Posts';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private useRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(Post) private postRepository: Repository<Post>,
    ) {}

    findUsers(){
        return this.useRepository.find({ relations: ['profile', 'posts']});
    }

    createUser(userDetails: CreateUserParams){
        const newUser = this.useRepository.create({
            ...userDetails,
            createdAt: new Date()
        })

        return this.useRepository.save(newUser);
    }

    updateUser(id: number, userDetails: UpdateUserParams){
        return this.useRepository.update({ id }, { ...userDetails })
    }

    deleteUser(id: number){
        return this.useRepository.delete({id});
    }

    async createUserProfile(id: number, userProfileDetails: CreateProfileUserParams){
        const user = await this.useRepository.findOneBy({ id });
        if(!user){
            throw new HttpException('User not found. Cannot create profile', HttpStatus.BAD_REQUEST);
        }

        const newProfile = this.profileRepository.create(userProfileDetails);
        const savedProfiled = await this.profileRepository.save(newProfile);
        user.profile = savedProfiled;
        return this.useRepository.save(user);
    }

    async createUserPost(id: number, createUserPost: CreateUserPostParams){
        const user = await this.useRepository.findOneBy({ id });

        if(!user){
            throw new HttpException('User not found. Cannot create post', HttpStatus.BAD_REQUEST);
        }

        const newPost = this.postRepository.create({...createUserPost, user});
        return this.postRepository.save(newPost);
    }
}
