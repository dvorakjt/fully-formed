import type { CombinedValidatorSuiteResult } from '../../types';

export abstract class AbstractCombinedValidatorSuite<T> {
  public abstract validate(value: T): CombinedValidatorSuiteResult<T>;
}
