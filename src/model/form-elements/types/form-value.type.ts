import type { FormMembers } from './form-members.type';
import type { FormChild, PossiblyTransient } from '../interfaces';
import type { Excludable, ValueOf } from '../../shared';
import type { IAdapter } from '../../adapters';

type NonTransient<T extends FormChild> =
  T extends PossiblyTransient ?
    T['transient'] extends false ?
      T
    : never
  : T;

type ExcludableFieldValues<T extends readonly FormChild[]> = {
  [F in T[number] as NonTransient<F> extends never ? never
  : F extends Excludable ? F['name']
  : never]+?: ValueOf<F>;
};

type NonExcludableFieldValues<T extends readonly FormChild[]> = {
  [F in T[number] as NonTransient<F> extends never ? never
  : F extends Excludable ? never
  : F['name']]: ValueOf<F>;
};

type ExcludableAdapterValues<T extends readonly IAdapter[]> = {
  [A in T[number] as A extends Excludable ? A['name'] : never]+?: ValueOf<A>;
};

type NonExcludableAdapterValues<T extends readonly IAdapter[]> = {
  [A in T[number] as A extends Excludable ? never : A['name']]: ValueOf<A>;
};

export type FormValue<T extends FormMembers> = ExcludableFieldValues<
  T['fields']
> &
  NonExcludableFieldValues<T['fields']> &
  ExcludableAdapterValues<T['adapters']> &
  NonExcludableAdapterValues<T['adapters']>;
