import {
  AbstractForm,
  AbstractSubForm,
  AbstractExcludableSubForm,
  AbstractPersistentExcludableSubForm,
  type AllowedFormMembers,
} from '../form-elements';
import type {
  FormTemplate,
  PersistentExcludableSubFormTemplate,
  SubFormTemplate,
  TransientTemplate,
} from '../templates';
import type { Constructor } from '../shared';

type TransienceFromTemplate<T> =
  T extends TransientTemplate<boolean> ? T['transient'] : false;

export class FormFactory {
  public static createForm<
    Args extends unknown[],
    T extends FormTemplate & AllowedFormMembers<T>,
  >(Template: Constructor<Args, T>): Constructor<Args, AbstractForm<T>> {
    return class extends AbstractForm<T> {
      public constructor(...args: Args) {
        super(new Template(...args));
      }
    };
  }

  public static createSubForm<
    Args extends unknown[],
    T extends SubFormTemplate & AllowedFormMembers<T>,
  >(
    Template: Constructor<Args, T>,
  ): Constructor<
    Args,
    AbstractSubForm<T['name'], T, TransienceFromTemplate<T>>
  > {
    return class extends AbstractSubForm<
      T['name'],
      T,
      TransienceFromTemplate<T>
    > {
      public constructor(...args: Args) {
        super(new Template(...args));
      }
    };
  }

  public static createExcludableSubForm<
    Args extends unknown[],
    T extends SubFormTemplate & AllowedFormMembers<T>,
  >(
    Template: Constructor<Args, T>,
  ): Constructor<
    Args,
    AbstractExcludableSubForm<T['name'], T, TransienceFromTemplate<T>>
  > {
    return class extends AbstractExcludableSubForm<
      T['name'],
      T,
      TransienceFromTemplate<T>
    > {
      public constructor(...args: Args) {
        super(new Template(...args));
      }
    };
  }

  public static createPersistentExcludableSubForm<
    Args extends unknown[],
    T extends PersistentExcludableSubFormTemplate & AllowedFormMembers<T>,
  >(
    Template: Constructor<Args, T>,
  ): Constructor<
    Args,
    AbstractPersistentExcludableSubForm<T['name'], T, TransienceFromTemplate<T>>
  > {
    return class extends AbstractPersistentExcludableSubForm<
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
