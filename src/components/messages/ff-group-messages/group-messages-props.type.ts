import type { AnyForm } from '../../../model';

export type GroupMessagesProps<Form extends AnyForm> = {
  form: Form;
  groups: Array<Form['groups'][keyof Form['groups']]>;
  containerId?: string;
};
