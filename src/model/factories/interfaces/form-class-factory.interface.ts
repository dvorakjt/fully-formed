import type {
  AbstractExcludableSubForm,
  AbstractForm,
  AbstractSubForm,
} from '../../form-elements';
import type {
  InitFormReturnType,
  AllowedInitFormReturnType,
  InitForm,
  InitFormReturnTypeToFormConstituents,
  InitSubFormReturnType,
  InitSubForm,
  InitExcludableSubFormReturnType,
  InitExcludableSubForm,
} from '../types';

export interface FormClassFactory {
  extendForm<
    Args extends unknown[],
    T extends InitFormReturnType & AllowedInitFormReturnType<T>,
  >(
    init: InitForm<Args, T>,
  ): AbstractForm<T['name'], InitFormReturnTypeToFormConstituents<T>>;
  extendSubForm<
    Args extends unknown[],
    T extends InitSubFormReturnType & AllowedInitFormReturnType<T>,
  >(
    init: InitSubForm<Args, T>,
  ): AbstractSubForm<
    T['name'],
    InitFormReturnTypeToFormConstituents<T>,
    T['transient'] extends boolean ? T['transient'] : false
  >;
  extendExcludableSubForm<
    Args extends unknown[],
    T extends InitExcludableSubFormReturnType & AllowedInitFormReturnType<T>,
  >(
    init: InitExcludableSubForm<Args, T>,
  ): AbstractExcludableSubForm<
    T['name'],
    InitFormReturnTypeToFormConstituents<T>,
    T['transient'] extends boolean ? T['transient'] : false
  >;
}
