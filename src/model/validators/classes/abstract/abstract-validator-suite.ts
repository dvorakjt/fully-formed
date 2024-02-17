import type { StateWithMessages } from '../../../state';

/**
 * Manages the validation of a value of a given type against a sequence of validators.
 */
export abstract class AbstractValidatorSuite<T> {
  public abstract validate(value: T): StateWithMessages<T>;
}
