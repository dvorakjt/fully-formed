import type { Validity } from '../../shared';

export type ValidityReducerMemberState = {
  validity: Validity;
  exclude?: boolean;
};
