import type { Validity } from '../../state';

export type ValidityReducerMemberState = {
  validity: Validity;
  exclude?: boolean;
};
