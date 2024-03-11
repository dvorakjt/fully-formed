import type { StateWithMessages } from '../../state';
import type { FormConstituents } from './form-constituents.type';
import type { FormValue } from './form-value.type';

export type FormState<Constituents extends FormConstituents>= StateWithMessages<FormValue<Constituents>>;
