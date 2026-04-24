import {Entity, model, property} from '@loopback/repository';

@model()
export class Exercise extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  sets: number;

  @property({
    type: 'number',
    required: true,
  })
  reps: number;

  @property({
    type: 'number',
    required: false,
  })
  weight: number;

  @property({
    type: 'string',
    required: true,
  })
  workoutId: string;


  constructor(data?: Partial<Exercise>) {
    super(data);
  }
}

export interface ExerciseRelations {
  // describe navigational properties here
}

export type ExerciseWithRelations = Exercise & ExerciseRelations;
