import type { AbstractSubForm } from '../classes';
import type { FormElement } from './form-element.type';

interface FormElementsObject {
  [key: string]: FormElement;
}

type FieldNamesFromFormElementsObject<
  FormElementsObj extends FormElementsObject,
  K = keyof FormElementsObj,
> =
  K extends string ?
    FormElementsObj[K] extends (
      AbstractSubForm<
        string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        boolean
      >
    ) ?
      FieldNamesFromFormElementsObject<FormElementsObj[K]['formElements']>
    : K
  : never;

type FieldNamesFromFormElementsArray<
  FormElements extends readonly FormElement[],
> = {
  [K in keyof FormElements]: FormElements[K] extends (
    AbstractSubForm<
      string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      boolean
    >
  ) ?
    FieldNamesFromFormElementsObject<FormElements[K]['formElements']>
  : FormElements[K]['name'];
}[number];

export type FirstNonValidField<FormElements extends readonly FormElement[]> = {
  name: FieldNamesFromFormElementsArray<FormElements>;
  id: string;
};
