import type { FormTemplate } from '../classes';

export type TemplateToConstituents<T extends FormTemplate> = {
  formElements: T['formElements'];
  adapters: T['adapters'];
  groups: T['groups'];
  derivedValues: T['derivedValues'];
};
