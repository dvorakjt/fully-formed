import type { Observable } from 'rxjs';
import type { StateWithMessages } from '../../state';

export type CombinedValidatorSuiteResult<Value> = {
  syncResult: StateWithMessages<Value>;
  observableResult?: Observable<StateWithMessages<Value>>;
};
