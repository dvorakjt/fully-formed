import type { FormElement, AutoTrim } from '../../form-elements';

export type CreateFormOpts<FormElements extends readonly FormElement[]> = {
  autoTrim?: AutoTrim<FormElements>;
  id?: string;
  invalidMessage?: string;
  pendingMessage?: string;
  validMessage?: string;
};
