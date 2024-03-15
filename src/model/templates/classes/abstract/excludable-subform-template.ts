import { SubFormTemplate } from './subform-template';

export abstract class ExcludableSubFormTemplate extends SubFormTemplate {
  public excludeByDefault?: boolean;
}
