import type { AbstractAdapter } from '../../adapters';
import type { FormElement, AutoTrim } from '../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../groups';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormReducerFactory } from '../classes';

/**
 * An object provided as an argument to the `createFormReducer()` method
 * of the {@link FormReducerFactory} class.
 */
export type CreateFormReducerArgs = {
  formElements: readonly FormElement[];
  customAdapters: ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >;
  groups: ReadonlyArray<AbstractGroup<string, GroupMembers>>;
  autoTrim: AutoTrim;
};
