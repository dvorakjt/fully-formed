import { Form, SubForm, ExcludableSubForm } from '../../../form-elements';
import type {
  ControllableTemplate,
  FormTemplate,
  SubFormTemplate,
} from '../../../templates';
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

/**
 * A static class that can be used to extend {@link Form}, {@link SubForm} and
 * {@link ExcludableSubForm} by providing instances of {@link FormTemplate} to
 * its methods.
 */
export class FormFactory {
  /**
   * Creates a class that extends {@link Form}.
   *
   * @typeParam T - A class that extends {@link FormTemplate} and meets the
   * criteria specified by {@link AllowedConstituents}.
   *
   * @typeParam Args - The arguments required to instantiate an instance of `T`,
   * which will become the arguments required to instantiate an instance of the
   * resultant {@link Form} subclass.
   *
   * @param Template - A class that extends {@link FormTemplate} and meets the
   * criteria specified by {@link AllowedConstituents}.
   *
   * @returns A class that extends {@link Form}.
   */
  public static createForm<
    Args extends unknown[],
    T extends FormTemplate & AllowedConstituents<T>,
  >(Template: Constructor<Args, T>): Constructor<Args, AbstractForm<T>> {
    return class extends Form<T> {
      public constructor(...args: Args) {
        super(new Template(...args));
      }
    };
  }

  /**
   * Creates a class that extends {@link SubForm}.
   *
   * @typeParam T - A class that extends {@link FormTemplate} and meets the
   * criteria specified by {@link AllowedConstituents}.
   *
   * @typeParam Args - The arguments required to instantiate an instance of `T`,
   * which will become the arguments required to instantiate an instance of the
   * resultant {@link SubForm} subclass.
   *
   * @param Template - A class that extends {@link FormTemplate} and meets the
   * criteria specified by {@link AllowedConstituents}.
   *
   * @returns A class that extends {@link SubForm}.
   */
  public static createSubForm<
    Args extends unknown[],
    T extends SubFormTemplate & AllowedConstituents<T>,
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

  /**
   * Creates a class that extends {@link ExcludableSubForm}.
   *
   * @typeParam T - A class that extends {@link FormTemplate}, meets the
   * criteria specified by {@link AllowedConstituents}, and may extend
   * {@link ControllableTemplate}.
   *
   * @typeParam Args - The arguments required to instantiate an instance of `T`,
   * which will become the arguments required to instantiate an instance of the
   * resultant {@link ExcludableSubForm} subclass.
   *
   * @typeParam Controller - A {@link FormElement} or {@link AbstractGroup}
   * whose state controls whether or not an instance of the resultant class is
   * excluded.
   *
   * @param Template - A class that extends {@link FormTemplate}, meets the
   * criteria specified by {@link AllowedConstituents}, and may extend
   * {@link ControllableTemplate}.
   *
   * @returns A class that extends {@link ExcludableSubForm}.
   */
  public static createExcludableSubForm<
    Args extends unknown[],
    Controller extends FormElement | AbstractGroup<string, GroupMembers>,
    T extends
      | (SubFormTemplate & AllowedConstituents<T>)
      | (SubFormTemplate &
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
