import type { AnyStringTypeField } from '../../../model';

export type Option<Field extends AnyStringTypeField> = {
  value: Field['state']['value'];
  text: string;
};
