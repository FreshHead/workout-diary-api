import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Workout} from '../models';
import {WorkoutRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';

export class WorkoutController {
  constructor(
    @repository(WorkoutRepository)
    public workoutRepository : WorkoutRepository,
  ) {}

  @authenticate('jwt')
  @post('/workouts')
  @response(200, {
    description: 'Workout model instance',
    content: {'application/json': {schema: getModelSchemaRef(Workout)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workout, {
            title: 'NewWorkout',
            exclude: ['id'],
          }),
        },
      },
    })
    workout: Omit<Workout, 'id'>,
  ): Promise<Workout> {
    return this.workoutRepository.create(workout);
  }

  @authenticate('jwt')
  @get('/workouts/count')
  @response(200, {
    description: 'Workout model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Workout) where?: Where<Workout>,
  ): Promise<Count> {
    return this.workoutRepository.count(where);
  }

  @authenticate('jwt')
  @get('/workouts')
  @response(200, {
    description: 'Array of Workout model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Workout, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Workout) filter?: Filter<Workout>,
  ): Promise<Workout[]> {
    return this.workoutRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/workouts')
  @response(200, {
    description: 'Workout PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workout, {partial: true}),
        },
      },
    })
    workout: Workout,
    @param.where(Workout) where?: Where<Workout>,
  ): Promise<Count> {
    return this.workoutRepository.updateAll(workout, where);
  }

  @authenticate('jwt')
  @get('/workouts/{id}')
  @response(200, {
    description: 'Workout model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Workout, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Workout, {exclude: 'where'}) filter?: FilterExcludingWhere<Workout>
  ): Promise<Workout> {
    return this.workoutRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/workouts/{id}')
  @response(204, {
    description: 'Workout PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workout, {partial: true}),
        },
      },
    })
    workout: Workout,
  ): Promise<void> {
    await this.workoutRepository.updateById(id, workout);
  }

  @authenticate('jwt')
  @put('/workouts/{id}')
  @response(204, {
    description: 'Workout PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() workout: Workout,
  ): Promise<void> {
    await this.workoutRepository.replaceById(id, workout);
  }

  @authenticate('jwt')
  @del('/workouts/{id}')
  @response(204, {
    description: 'Workout DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.workoutRepository.deleteById(id);
  }
}
