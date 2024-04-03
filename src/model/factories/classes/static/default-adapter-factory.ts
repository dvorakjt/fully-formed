import {
  DefaultAdapter,
  DefaultExcludableAdapter,
  type AbstractAdapter,
} from '../../../adapters';
import {
  AbstractExcludableField,
  AbstractExcludableSubForm,
  type FormElement,
  type AutoTrim,
} from '../../../form-elements';
import type { CreateDefaultAdaptersArgs } from '../../types';

/**
 * A static class that is responsible for instantiating {@link DefaultAdapter}
 * and {@link DefaultExcludableAdapter}s for all non-transient form elements
 * within a form.
 */
export class DefaultAdapterFactory {
  /**
   * Instantiates {@link DefaultAdapter}s and {@link DefaultExcludableAdapter}s
   * for all non-transient form elements it receives and applies auto-trim to 
   * string-type fields depending on the value of `autoTrim` in the object it
   * receives as an argument.
   * 
   * @param createDefaultAdapterArgs - An object containing an array of form
   * elements to create {@link DefaultAdapter}s and 
   * {@link DefaultExcludableAdapter}s for, and an `autoTrim` property which
   * determines which string-type fields will be auto-trimmed.
   * 
   * @returns An array of {@link AbstractAdapter}s.
   */
  public static createDefaultAdapters({
    formElements,
    autoTrim,
  }: CreateDefaultAdaptersArgs): Array<
    AbstractAdapter<string, FormElement, unknown>
  > {
    return formElements
      .filter(formElement => !formElement.transient)
      .map(formElement => {
        if (
          formElement instanceof AbstractExcludableField ||
          formElement instanceof AbstractExcludableSubForm
        ) {
          return new DefaultExcludableAdapter({
            source: formElement,
            adaptFn:
              DefaultAdapterFactory.applyAutoTrim(formElement, autoTrim) ?
                (value): string => (value as string).trim()
              : undefined,
          });
        }
        return new DefaultAdapter({
          source: formElement,
          adaptFn:
            DefaultAdapterFactory.applyAutoTrim(formElement, autoTrim) ?
              (value): string => (value as string).trim()
            : undefined,
        });
      });
  }

  private static applyAutoTrim(
    formElement: FormElement,
    autoTrim: AutoTrim,
  ): boolean {
    if (typeof formElement.state.value === 'string') {
      if (typeof autoTrim === 'object') {
        if (
          'include' in autoTrim &&
          autoTrim.include.includes(formElement.name)
        ) {
          return true;
        }
        if (
          'exclude' in autoTrim &&
          !autoTrim.exclude.includes(formElement.name)
        ) {
          return true;
        }
      } else {
        return autoTrim;
      }
    }
    return false;
  }
}
