import { FormReducer, type AbstractFormReducer } from '../../../reducers';
import { DefaultAdapterFactory } from './default-adapter-factory';
import type { FormConstituents } from '../../../form-elements';
import type { CreateFormReducerArgs } from '../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AutoTrim } from '../../../form-elements';

/**
 * A static class which is responsible for instantiating an
 * {@link AbstractFormReducer} for a form, given its form elements,
 * adapters, groups and other properties.
 */
export class FormReducerFactory {
  /**
   * Instantiates an {@link AbstractFormReducer}.
   *
   * @typeParam Constituents - An object that extends {@link FormConstituents}.
   *
   * @param createFormReducerArgs - An object containing arrays of form
   * elements, adapters, groups and an `autoTrim` property which determines
   * how string-type fields will be auto-trimmed.
   *
   * @returns An instance of {@link AbstractFormReducer}.
   */
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
