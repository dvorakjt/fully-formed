import type { FormConstituents } from '../types';
import type { AbstractField, AbstractSubForm } from '../classes';

export type FormElement =
  | AbstractField<string, unknown, boolean>
  | AbstractSubForm<string, FormConstituents, boolean>;
