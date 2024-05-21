import type { ValidatorResult } from '../types';

export interface IValidator<T> {
  validate(value: T): ValidatorResult;
}
