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
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Workout} from '../models';
import {WorkoutRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';

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
    @inject(SecurityBindings.USER) currentUser: UserProfile,
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
    const userId = currentUser[securityId];
    return this.workoutRepository.create({...workout, userId});
  }

  @authenticate('jwt')
  @get('/workouts/count')
  @response(200, {
    description: 'Workout model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.where(Workout) where?: Where<Workout>,
  ): Promise<Count> {
    const userId = currentUser[securityId];
    return this.workoutRepository.count({...where, userId});
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
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.filter(Workout) filter?: Filter<Workout>,
  ): Promise<Workout[]> {
    const userId = currentUser[securityId];
    return this.workoutRepository.find({...filter, where: {...filter?.where, userId}});
  }

  @authenticate('jwt')
  @patch('/workouts')
  @response(200, {
    description: 'Workout PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
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
    const userId = currentUser[securityId];
    return this.workoutRepository.updateAll(workout, {...where, userId});
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
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @param.filter(Workout, {exclude: 'where'}) filter?: FilterExcludingWhere<Workout>
  ): Promise<Workout> {
    const userId = currentUser[securityId];
    const workout = await this.workoutRepository.findById(id, filter);
    if(workout.userId !== userId){
      throw new HttpErrors.Forbidden()
    }
    return workout;
  }

  @authenticate('jwt')
  @patch('/workouts/{id}')
  @response(204, {
    description: 'Workout PATCH success',
  })
  async updateById(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
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
    const userId = currentUser[securityId];
    const workoutWithUserId = await this.workoutRepository.findById(id);
    if(workoutWithUserId.userId !== userId){
      throw new HttpErrors.Forbidden()
    }
    await this.workoutRepository.updateById(id, workout);
  }

  @authenticate('jwt')
  @del('/workouts/{id}')
  @response(204, {
    description: 'Workout DELETE success',
  })
  async deleteById(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('id') id: string
  ): Promise<void> {
    const userId = currentUser[securityId];
    const workoutWithUserId = await this.workoutRepository.findById(id);
    if(workoutWithUserId.userId !== userId){
      throw new HttpErrors.Forbidden()
    }

    await this.workoutRepository.deleteById(id);
  }
}
