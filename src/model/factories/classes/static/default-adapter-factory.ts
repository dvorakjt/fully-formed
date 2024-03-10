import {
  DefaultAdapter,
  DefaultExcludableAdapter,
  type AbstractAdapter,
} from '../../../adapters';
import {
  AbstractExcludableField,
  AbstractExcludableSubForm,
  type FormElement,
} from '../../../form-elements';
import type { NonGenericAutoTrim } from '../../types';

export class DefaultAdapterFactory {
  public static createDefaultAdapters(
    formElements: readonly FormElement[],
    autoTrim: NonGenericAutoTrim,
  ): Array<AbstractAdapter<string, FormElement, unknown>> {
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
              DefaultAdapterFactory.applyNonGenericAutoTrim(formElement, autoTrim) ?
                (value): string => (value as string).trim()
              : undefined,
          });
        }
        return new DefaultAdapter({
          source: formElement,
          adaptFn:
            DefaultAdapterFactory.applyNonGenericAutoTrim(formElement, autoTrim) ?
              (value): string => (value as string).trim()
            : undefined,
        });
      });
  }

  private static applyNonGenericAutoTrim(
    formElement: FormElement,
    autoTrim: NonGenericAutoTrim,
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
