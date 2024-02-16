import type { Validity } from '../enums';

export type State<Value> = {
  value: Value;
  validity: Validity;
};
