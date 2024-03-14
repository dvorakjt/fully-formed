import { Form, SubForm } from '../../../form-elements';
import type { FormTemplate } from '../../../templates';
import type { Constructor } from '../../../shared';
import type { AllowedConstituents } from '../../../form-elements';
import type { CreateFormOpts, CreateSubFormOpts } from '../../types';

export class FormFactory {
  public static createForm<
    Args extends unknown[],
    T extends FormTemplate & AllowedConstituents<T>,
  >(
    Template: Constructor<Args, T>,
    opts?: CreateFormOpts<T['formElements']>,
  ): Constructor<Args, Form<T['name'], T>> {
    return class extends Form<T['name'], T> {
      public constructor(...args: Args) {
        super({
          ...opts,
          ...new Template(...args),
        });
      }
    };
  }

  public static createSubForm<
    Args extends unknown[],
    T extends FormTemplate & AllowedConstituents<T>,
    Transient extends boolean = false,
  >(
    Template: Constructor<Args, T>,
    opts?: CreateSubFormOpts<T['formElements'], Transient>,
  ): Constructor<Args, SubForm<T['name'], T, Transient>> {
    return class extends SubForm<T['name'], T, Transient> {
      public constructor(...args: Args) {
        super({
          ...opts,
          ...new Template(...args),
        });
      }
    };
  }
}
