import type { Observable } from 'rxjs';
import type { StateWithMessages } from '../../state';
import type {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AbstractCombinedValidatorSuite,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AbstractAsyncValidator,
} from '../classes';

/**
 * An object returned by the `validate()` method of an
 * {@link AbstractCombinedValidatorSuite}.
 *
 * @remarks
 * If the suite includes at least one {@link AbstractAsyncValidator}, when the
 * syncResult would be valid, it instead becomes pending and an
 * `observableResult` will be present in this object.
 */
export type CombinedValidatorSuiteResult<Value> = {
  syncResult: StateWithMessages<Value>;
  observableResult?: Observable<StateWithMessages<Value>>;
};
