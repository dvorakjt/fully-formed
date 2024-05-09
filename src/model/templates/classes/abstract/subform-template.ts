import { FormTemplate } from './form-template';

export abstract class SubFormTemplate extends FormTemplate {
  public abstract name: string;
  public id?: string;
}
