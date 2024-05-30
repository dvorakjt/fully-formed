import { FormReducer } from '../reducers';
import { applyAutoTrim } from '../utils';
import type { FormMembers, AutoTrim } from '../form-elements';

type CreateFormReducerParams<T extends FormMembers> = {
  fields: T['fields'];
  adapters: T['adapters'];
  groups: T['groups'];
  autoTrim: AutoTrim;
};

export class FormReducerFactory {
  public static createFormReducer<T extends FormMembers>({
    fields,
    adapters,
    groups,
    autoTrim,
  }: CreateFormReducerParams<T>): FormReducer<T> {
    const nonTransientFieldsAndAdapters = [
      ...applyAutoTrim(
        fields.filter(field => !('transient' in field) || !field.transient),
        autoTrim,
      ),
      ...adapters,
    ];

    const transientFields = fields.filter(
      field => 'transient' in field && field.transient,
    );
    return new FormReducer<T>({
      nonTransientFieldsAndAdapters,
      transientFields,
      groups,
    });
  }
}
