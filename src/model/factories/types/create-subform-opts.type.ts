import type { CreateFormOpts } from './create-form-opts.type';
import type { FormElement } from '../../form-elements';

export type CreateSubFormOpts<
  FormElements extends readonly FormElement[],
  Transient extends boolean,
> = CreateFormOpts<FormElements> & {
  transient?: Transient;
};
