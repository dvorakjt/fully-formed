import type { InitFormReturnType } from './init-form-return-type.type';

export type InitSubFormReturnType = InitFormReturnType & {
  transient?: boolean;
};
