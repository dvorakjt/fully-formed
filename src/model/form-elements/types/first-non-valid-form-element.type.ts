import type { FormElement } from './form-element.type';

export type FirstNonValidFormElement<
  FormElements extends readonly FormElement[],
> = {
  name: FormElements[number]['name'];
  id: string;
};
