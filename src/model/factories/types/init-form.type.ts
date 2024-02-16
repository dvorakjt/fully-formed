import type { AllowedInitFormReturnType } from './allowed-init-form-return-type.type';
import type { InitFormReturnType } from './init-form-return-type.type';

export type InitForm<
  Args extends unknown[],
  T extends InitFormReturnType & AllowedInitFormReturnType<T>,
> = (...args: Args) => T;
