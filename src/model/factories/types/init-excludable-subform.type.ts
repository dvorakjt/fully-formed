import type { AllowedInitFormReturnType } from './allowed-init-form-return-type.type';
import type { InitExcludableSubFormReturnType } from './init-excludable-subform-return-type.type';

export type InitExcludableSubForm<
  Args extends unknown[],
  T extends InitExcludableSubFormReturnType & AllowedInitFormReturnType<T>,
> = (...args: Args) => T;
