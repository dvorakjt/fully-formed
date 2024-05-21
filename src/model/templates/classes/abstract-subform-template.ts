import { AbstractFormTemplate } from './abstract-form-template';

export abstract class AbstractSubFormTemplate extends AbstractFormTemplate {
  public abstract name: string;
  public id?: string;
}
