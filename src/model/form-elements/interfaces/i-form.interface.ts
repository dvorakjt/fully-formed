import type {
  Validated,
  ValidatedState,
  RecordFromNameableArray,
  Merged,
} from '../../shared';
import type { FormMembers, FormValue } from '../types';
import type { Submittable, SubmittableState } from './submittable.interface';

export type FormState<T extends FormMembers = FormMembers> = ValidatedState<
  FormValue<T>
> &
  SubmittableState;

export interface IForm<T extends FormMembers = FormMembers>
  extends Merged<Validated<FormValue<T>> & Submittable> {
  fields: RecordFromNameableArray<T['fields']>;
  groups: RecordFromNameableArray<T['groups']>;
}
