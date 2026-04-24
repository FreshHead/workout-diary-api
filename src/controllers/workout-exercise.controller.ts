import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Workout,
  Exercise,
} from '../models';
import {WorkoutRepository} from '../repositories';

export class WorkoutExerciseController {
  constructor(
    @repository(WorkoutRepository) protected workoutRepository: WorkoutRepository,
  ) { }

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
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Exercise>,
  ): Promise<Exercise[]> {
    return this.workoutRepository.exercises(id).find(filter);
  }

  @post('/workouts/{id}/exercises', {
    responses: {
      '200': {
        description: 'Workout model instance',
        content: {'application/json': {schema: getModelSchemaRef(Exercise)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Workout.prototype.id,
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
    return this.workoutRepository.exercises(id).create(exercise);
  }

  @patch('/workouts/{id}/exercises', {
    responses: {
      '200': {
        description: 'Workout.Exercise PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
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
    return this.workoutRepository.exercises(id).patch(exercise, where);
  }

  @del('/workouts/{id}/exercises', {
    responses: {
      '200': {
        description: 'Workout.Exercise DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Exercise)) where?: Where<Exercise>,
  ): Promise<Count> {
    return this.workoutRepository.exercises(id).delete(where);
  }
}
