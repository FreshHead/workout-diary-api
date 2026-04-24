import {hasMany, model} from '@loopback/repository';
import {User as JwtUser} from '@loopback/authentication-jwt';
import { Workout } from './workout.model';

@model()
export class User extends JwtUser {

  @hasMany(() => Workout)
  workouts: Workout[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
