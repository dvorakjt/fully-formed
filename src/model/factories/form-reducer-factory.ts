import { FormReducer } from '../reducers';
import { DefaultAdapterFactory } from './default-adapter-factory';
import type { FormMembers, AutoTrim } from '../form-elements';

type CreateFormReducerParams<T extends FormMembers> = {
  fields: T['fields'];
  groups: T['groups'];
  customAdapters: T['adapters'];
  autoTrim: AutoTrim;
};

export class FormReducerFactory {
  public static createFormReducer<T extends FormMembers>({
    fields,
    customAdapters,
    groups,
    autoTrim,
  }: CreateFormReducerParams<T>): FormReducer<T> {
    const adapters = [
      ...DefaultAdapterFactory.createDefaultAdapters({
        fields,
        autoTrim,
      }),
      ...customAdapters,
    ];
    const transientFields = fields.filter(field => field.transient);
    return new FormReducer<T>({
      transientFields,
      groups,
      adapters,
    });
  }
}
