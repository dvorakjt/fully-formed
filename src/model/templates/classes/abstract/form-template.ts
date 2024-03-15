import type { AutoTrim, FormElement } from '../../../form-elements';
import type { AbstractAdapter } from '../../../adapters';
import type { AbstractGroup, GroupMembers } from '../../../groups';
import type { AbstractDerivedValue } from '../../../derived-values';

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
