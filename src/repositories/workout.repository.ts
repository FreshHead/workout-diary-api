import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Workout, WorkoutRelations, Exercise} from '../models';
import {ExerciseRepository} from './exercise.repository';

export class WorkoutRepository extends DefaultCrudRepository<
  Workout,
  typeof Workout.prototype.Id,
  WorkoutRelations
> {

  public readonly exercises: HasManyRepositoryFactory<Exercise, typeof Workout.prototype.Id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ExerciseRepository') protected exerciseRepositoryGetter: Getter<ExerciseRepository>,
  ) {
    super(Workout, dataSource);
    this.exercises = this.createHasManyRepositoryFactoryFor('exercises', exerciseRepositoryGetter,);
    this.registerInclusionResolver('exercises', this.exercises.inclusionResolver);
  }
}
