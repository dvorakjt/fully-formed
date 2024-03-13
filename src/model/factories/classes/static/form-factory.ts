import { Form } from "../../../form-elements";
import type { FormTemplate, TemplateToConstituents } from "../../../templates";
import type { Constructor } from '../../../shared';

export class FormFactory {
  public static createForm<Args extends unknown[], T extends FormTemplate>(Template : Constructor<Args, T>) : Constructor<Args, Form<T['name'], TemplateToConstituents<T>>> {
    return class extends Form<T['name'], TemplateToConstituents<T>> {
      public constructor(...args : Args) {
        super(
          new Template(...args)
        )
      }
    }
  }
}