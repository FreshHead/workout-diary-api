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

export class WorkoutController {
  constructor(
    @repository(WorkoutRepository)
    public workoutRepository : WorkoutRepository,
  ) {}

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

  @del('/workouts/{id}')
  @response(204, {
    description: 'Workout DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.workoutRepository.deleteById(id);
  }
}
