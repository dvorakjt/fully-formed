import type {
  AutoTrim,
  FormElement,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Form,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SubForm,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ExcludableSubForm,
} from '../../../form-elements';
import type { AbstractAdapter } from '../../../adapters';
import type { AbstractGroup, GroupMembers } from '../../../groups';
import type { AbstractDerivedValue } from '../../../derived-values';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormFactory } from '../../../factories';

/**
 * An abstract class whose subclasses may be provided to the `createForm()`,
 * `createSubForm()` and `createExcludableSubForm()` methods of the
 * {@link FormFactory} class in order to create classes that extend
 * {@link Form}, {@link SubForm} and {@link ExcludableSubForm}, respectively.
 * Defines defaults for many properties. At minimum requires the `name` and
 * `formElements` properties to be defined by subclasses.
 */
export abstract class FormTemplate {
  public abstract name: string;
  public abstract formElements: readonly FormElement[];
  public readonly adapters: ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  > = [];
  public readonly groups: ReadonlyArray<AbstractGroup<string, GroupMembers>> =
    [];
  public readonly derivedValues: ReadonlyArray<
    AbstractDerivedValue<string, unknown>
  > = [];
  public autoTrim: AutoTrim = false;
  public id?: string;
  public invalidMessage?: string;
  public pendingMessage?: string;
  public validMessage?: string;
}
