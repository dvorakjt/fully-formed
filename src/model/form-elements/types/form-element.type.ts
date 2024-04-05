import type { FormConstituents } from '../types';
import type { AbstractField, AbstractSubForm } from '../classes';

/**
 * An entity that can be nested inside a parent form. Includes fields and
 * sub-forms.
 */
export type FormElement =
  | AbstractField<string, unknown, boolean>
  | AbstractSubForm<string, FormConstituents, boolean>;
