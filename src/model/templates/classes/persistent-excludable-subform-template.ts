import { SubFormTemplate } from './subform-template';

export abstract class PersistentExcludableSubFormTemplate extends SubFormTemplate {
  public abstract key: string;
  public abstract excludeByDefault?: boolean;
}
