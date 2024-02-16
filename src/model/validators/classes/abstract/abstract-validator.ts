import type { ValidatorResult } from '../../types';

export abstract class AbstractValidator<T> {
  public abstract validate(value: T): ValidatorResult<T>;
}
