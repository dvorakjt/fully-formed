import { FormReducer, type AbstractFormReducer } from '../../../reducers';
import { DefaultAdapterFactory } from './default-adapter-factory';
import type { FormElement, FormConstituents } from '../../../form-elements';
import type { AbstractGroup, GroupMembers } from '../../../groups';
import type { NonGenericAutoTrim } from '../../types';
import type { AbstractAdapter } from '../../../adapters';

type CreateFormReducerArgs = {
  formElements: readonly FormElement[];
  customAdapters: ReadonlyArray<
    AbstractAdapter<
      string,
      FormElement | AbstractGroup<string, GroupMembers>,
      unknown
    >
  >;
  groups: ReadonlyArray<AbstractGroup<string, GroupMembers>>;
  autoTrim: NonGenericAutoTrim;
};

export class FormReducerFactory {
  public static createFormReducer<Constituents extends FormConstituents>({
    formElements,
    customAdapters,
    groups,
    autoTrim,
  }: CreateFormReducerArgs): AbstractFormReducer<Constituents> {
    const adapters = [
      ...DefaultAdapterFactory.createDefaultAdapters({
        formElements,
        autoTrim,
      }),
      ...customAdapters,
    ];
    const transientFormElements = formElements.filter(
      formElement => formElement.transient,
    );
    return new FormReducer<Constituents>({
      adapters,
      transientFormElements,
      groups,
    });
  }
}
