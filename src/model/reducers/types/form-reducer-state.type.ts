import type { FormConstituents, FormValue } from '../../form-elements';
import type { State } from '../../state';

export type FormReducerState<Constituents extends FormConstituents> = State<
  FormValue<Constituents>
>;
