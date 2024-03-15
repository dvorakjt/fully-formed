import { Form, SubForm, ExcludableSubForm } from '../../../form-elements';
import type { FormTemplate } from '../../../templates';
import type { Constructor } from '../../../shared';
import type {
  AbstractExcludableSubForm,
  AbstractForm,
  AbstractSubForm,
  AllowedConstituents,
} from '../../../form-elements';
import type { TransienceFromTemplate } from '../../types';

export class FormFactory {
  public static createForm<
    Args extends unknown[],
    T extends FormTemplate & AllowedConstituents<T>,
  >(
    Template: Constructor<Args, T>,
  ): Constructor<Args, AbstractForm<T['name'], T>> {
    return class extends Form<T['name'], T> {
      public constructor(...args: Args) {
        super(new Template(...args));
      }
    };
  }

  public static createSubForm<
    Args extends unknown[],
    T extends FormTemplate & AllowedConstituents<T>,
  >(
    Template: Constructor<Args, T>,
  ): Constructor<
    Args,
    AbstractSubForm<T['name'], T, TransienceFromTemplate<T>>
  > {
    return class extends SubForm<T['name'], T, TransienceFromTemplate<T>> {
      public constructor(...args: Args) {
        super(new Template(...args));
      }
    };
  }

  public static createExcludableSubForm<
    Args extends unknown[],
    T extends FormTemplate & AllowedConstituents<T>,
  >(
    Template: Constructor<Args, T>,
  ): Constructor<
    Args,
    AbstractExcludableSubForm<T['name'], T, TransienceFromTemplate<T>>
  > {
    return class extends ExcludableSubForm<
      T['name'],
      T,
      TransienceFromTemplate<T>
    > {
      public constructor(...args: Args) {
        super(new Template(...args));
      }
    };
  }
}
