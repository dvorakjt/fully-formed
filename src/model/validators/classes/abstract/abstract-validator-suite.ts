import type { StateWithMessages } from '../../../state';

export abstract class AbstractValidatorSuite<T> {
  public abstract validate(value: T): StateWithMessages<T>;
}
