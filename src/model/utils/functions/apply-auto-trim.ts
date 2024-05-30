import { Adapter, ExcludableAdapter, type IAdapter } from '../../adapters';
import { isExcludable } from './is-excludable';
import type { AutoTrim, FormChild } from '../../form-elements';
import type { Excludable } from '../../shared';

export function applyAutoTrim<T extends readonly FormChild[]>(
  fields: T,
  autoTrim: AutoTrim,
): Array<FormChild | IAdapter> {
  return fields.map(field => {
    if (shouldApplyAutoTrim(field, autoTrim)) {
      if (isExcludable(field)) {
        return new ExcludableAdapter({
          name: field.name,
          source: field as FormChild<string, string> & Excludable,
          adaptFn: ({ value, exclude }) => ({
            value: value.trim(),
            exclude,
          }),
        });
      } else {
        return new Adapter({
          name: field.name,
          source: field as FormChild<string, string>,
          adaptFn: ({ value }) => value.trim(),
        });
      }
    }

    return field;
  });
}

function shouldApplyAutoTrim(field: FormChild, autoTrim: AutoTrim): boolean {
  if (typeof field.state.value !== 'string') return false;
  if (typeof autoTrim === 'boolean') return autoTrim;

  if ('include' in autoTrim) {
    return autoTrim.include.includes(field.name);
  }

  return !autoTrim.exclude.includes(field.name);
}
