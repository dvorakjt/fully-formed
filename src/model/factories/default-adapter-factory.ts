import {
  DefaultAdapter,
  DefaultExcludableAdapter,
  type IAdapter,
} from '../adapters';
import { isExcludable } from '../utils';
import type { AutoTrim, FormChild } from '../form-elements';

type CreateDefaultAdaptersParams = {
  fields: readonly FormChild[];
  autoTrim: AutoTrim;
};

export class DefaultAdapterFactory {
  public static createDefaultAdapters({
    fields,
    autoTrim,
  }: CreateDefaultAdaptersParams): IAdapter[] {
    return fields
      .filter(field => !field.transient)
      .map(field => {
        if (isExcludable(field)) {
          return new DefaultExcludableAdapter({
            source: field,
            adaptFn:
              DefaultAdapterFactory.applyAutoTrim(field, autoTrim) ?
                (value): string => (value as string).trim()
              : undefined,
          });
        }
        return new DefaultAdapter({
          source: field,
          adaptFn:
            DefaultAdapterFactory.applyAutoTrim(field, autoTrim) ?
              (value): string => (value as string).trim()
            : undefined,
        });
      });
  }

  private static applyAutoTrim(field: FormChild, autoTrim: AutoTrim): boolean {
    if (typeof field.state.value === 'string') {
      if (typeof autoTrim === 'object') {
        if ('include' in autoTrim && autoTrim.include.includes(field.name)) {
          return true;
        }
        if ('exclude' in autoTrim && !autoTrim.exclude.includes(field.name)) {
          return true;
        }
      } else {
        return autoTrim;
      }
    }
    return false;
  }
}
