import type { FormChild, AutoTrim } from '../../form-elements';
import type { IAdapter } from '../../adapters';
import type { IGroup } from '../../groups';

export abstract class AbstractFormTemplate {
  public abstract fields: readonly FormChild[];
  public groups: readonly IGroup[] = [];
  public adapters: readonly IAdapter[] = [];
  public autoTrim: AutoTrim = false;
}
