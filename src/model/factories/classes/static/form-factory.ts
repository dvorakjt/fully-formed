import { Form, SubForm, ExcludableSubForm } from '../../../form-elements';
import type { ControllableTemplate, FormTemplate } from '../../../templates';
import type { Constructor } from '../../../shared';
import type {
  AbstractExcludableSubForm,
  AbstractForm,
  AbstractSubForm,
  AllowedConstituents,
  FormElement,
} from '../../../form-elements';
import type { TransienceFromTemplate } from '../../types';
import type { AbstractGroup, GroupMembers } from '../../../groups';

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
    Controller extends FormElement | AbstractGroup<string, GroupMembers>,
    T extends
      | (FormTemplate & AllowedConstituents<T>)
      | (FormTemplate &
          AllowedConstituents<T> &
          ControllableTemplate<Controller>),
  >(
    Template: Constructor<Args, T>,
  ): Constructor<
    Args,
    AbstractExcludableSubForm<T['name'], T, TransienceFromTemplate<T>>
  > {
    return class extends ExcludableSubForm<
      T['name'],
      T,
      TransienceFromTemplate<T>,
      Controller
    > {
      public constructor(...args: Args) {
        super(new Template(...args));
      }
    };
  }
}
