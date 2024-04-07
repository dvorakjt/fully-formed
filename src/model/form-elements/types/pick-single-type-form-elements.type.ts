import type { AbstractForm } from '../classes';
import type { FormConstituents } from './form-constituents.type';
import type { FormElement } from './form-element.type';

export type PickSingleTypeFormElements<
  T extends AbstractForm<string, FormConstituents>,
  V extends FormElement,
> = Pick<
  T['formElements'],
  {
    [K in keyof T['formElements']]: T['formElements'][K] extends V ? K : never;
  }[keyof T['formElements']]
>;
