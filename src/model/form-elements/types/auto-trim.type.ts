import type { FormElement } from './form-element.type';
import type { AbstractField } from '../classes';

type NonTransientStringFields<FormElements extends readonly FormElement[]> =
  Extract<FormElements[number], AbstractField<string, string, false>>['name'];

export type AutoTrim<FormElements extends readonly FormElement[]> =
  | boolean
  | {
      include: Array<NonTransientStringFields<FormElements>>;
    }
  | {
      exclude: Array<NonTransientStringFields<FormElements>>;
    };
