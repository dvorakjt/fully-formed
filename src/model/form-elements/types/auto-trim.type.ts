import type { FormElement } from './form-element.type';
import type { AbstractField } from '../classes';

type NonTransientStringFieldNames<FormElements extends readonly FormElement[]> =
  Extract<FormElements, AbstractField<string, string, false>>['name'];

export type AutoTrim<FormElements extends readonly FormElement[]> =
  | boolean
  | {
      include: Array<NonTransientStringFieldNames<FormElements>>;
    }
  | {
      exclude: Array<NonTransientStringFieldNames<FormElements>>;
    };
