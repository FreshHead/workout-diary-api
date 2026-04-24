import {Getter, inject} from '@loopback/core';
import {DbDataSource} from '../datasources';
import {UserRepository as JwtUserRepository} from '@loopback/authentication-jwt';
import { UserCredentialsRepository } from '@loopback/authentication-jwt';
import { repository } from '@loopback/repository';
import { WorkoutRepository } from './workout.repository';

export class UserRepository extends JwtUserRepository {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserCredentialsRepository')
userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('WorkoutRepository') protected workoutRepositoryGetter: Getter<WorkoutRepository>
  ) {
    super(dataSource, userCredentialsRepositoryGetter);
  }
}
