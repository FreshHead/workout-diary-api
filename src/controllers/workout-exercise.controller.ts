import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Exercise,
} from '../models';
import {WorkoutRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class WorkoutExerciseController {
  constructor(
    @repository(WorkoutRepository) protected workoutRepository: WorkoutRepository,
  ) { }

  @authenticate('jwt')
  @get('/workouts/{id}/exercises', {
    responses: {
      '200': {
        description: 'Array of Workout has many Exercise',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Exercise)},
          },
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Exercise>,
  ): Promise<Exercise[]> {
    await this.assertWorkoutOwner(id, currentUser[securityId])
    return this.workoutRepository.exercises(id).find(filter);
  }

  @authenticate('jwt')
  @post('/workouts/{id}/exercises', {
    responses: {
      '200': {
        description: 'Workout model instance',
        content: {'application/json': {schema: getModelSchemaRef(Exercise)}},
      },
    },
  })
  async create(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exercise, {
            title: 'NewExerciseInWorkout',
            exclude: ['id'],
            optional: ['workoutId']
          }),
        },
      },
    }) exercise: Omit<Exercise, 'id'>,
  ): Promise<Exercise> {
    await this.assertWorkoutOwner(id, currentUser[securityId])
    return this.workoutRepository.exercises(id).create(exercise);
  }

  @authenticate('jwt')
  @patch('/workouts/{id}/exercises', {
    responses: {
      '200': {
        description: 'Workout.Exercise PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exercise, {partial: true}),
        },
      },
    })
    exercise: Partial<Exercise>,
    @param.query.object('where', getWhereSchemaFor(Exercise)) where?: Where<Exercise>,
  ): Promise<Count> {
    await this.assertWorkoutOwner(id, currentUser[securityId])
    return this.workoutRepository.exercises(id).patch(exercise, where);
  }

  @authenticate('jwt')
  @del('/workouts/{id}/exercises', {
    responses: {
      '200': {
        description: 'Workout.Exercise DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Exercise)) where?: Where<Exercise>,
  ): Promise<Count> {
    await this.assertWorkoutOwner(id, currentUser[securityId])
    return this.workoutRepository.exercises(id).delete(where);
  }

  private async assertWorkoutOwner(id: string, userId: string): Promise<void> {
    const workout = await this.workoutRepository.findById(id);
    if (workout.userId !== userId) {
      throw new HttpErrors.Forbidden();
    }
  }
}

