import { Form } from '../../../form-elements';
import type { FormTemplate } from '../../../templates';
import type { Constructor } from '../../../shared';
import type { AllowedConstituents } from '../../../form-elements';

export class FormFactory {
  public static createForm<
    Args extends unknown[],
    T extends FormTemplate & AllowedConstituents<T>,
  >(Template: Constructor<Args, T>): Constructor<Args, Form<T['name'], T>> {
    return class extends Form<T['name'], T> {
      public constructor(...args: Args) {
        super(new Template(...args));
      }
    };
  }
}
