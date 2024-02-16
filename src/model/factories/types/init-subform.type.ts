import type { AllowedInitFormReturnType } from './allowed-init-form-return-type.type';
import type { InitSubFormReturnType } from './init-subform-return-type.type';

export type InitSubForm<
  Args extends unknown[],
  T extends InitSubFormReturnType & AllowedInitFormReturnType<T>,
> = (...args: Args) => T;
