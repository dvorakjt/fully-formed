import type { State } from '../../state';
import type { FormConstituents } from './form-constituents.type';
import type { FormValue } from './form-value.type';

export type FormState<Constituents extends FormConstituents> = State<
  FormValue<Constituents>
>;
