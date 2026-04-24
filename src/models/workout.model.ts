import {Entity, model, property, hasMany} from '@loopback/repository';
import {Exercise} from './exercise.model';

@model()
export class Workout extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
  })
  notes?: string;

  @hasMany(() => Exercise)
  exercises: Exercise[];

  constructor(data?: Partial<Workout>) {
    super(data);
  }
}

export interface WorkoutRelations {
  // describe navigational properties here
}

export type WorkoutWithRelations = Workout & WorkoutRelations;
