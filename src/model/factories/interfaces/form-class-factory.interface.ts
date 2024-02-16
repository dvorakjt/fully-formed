import type { AbstractForm, AbstractSubForm } from '../../form-elements';
import type {
  InitFormReturnType,
  AllowedInitFormReturnType,
  InitForm,
  InitFormReturnTypeToFormConstituents,
  InitSubFormReturnType,
  InitSubForm,
} from '../types';

export interface FormClassFactory {
  createFormClass<
    Args extends unknown[],
    T extends InitFormReturnType & AllowedInitFormReturnType<T>,
  >(
    init: InitForm<Args, T>,
  ): AbstractForm<T['name'], InitFormReturnTypeToFormConstituents<T>>;
  createSubFormClass<
    Args extends unknown[],
    T extends InitSubFormReturnType & AllowedInitFormReturnType<T>,
  >(
    init: InitSubForm<Args, T>,
  ): AbstractSubForm<
    T['name'],
    InitFormReturnTypeToFormConstituents<T>,
    T['transient'] extends boolean ? T['transient'] : false,
    T['excludable'] extends boolean ? T['excludable'] : false
  >;
}
