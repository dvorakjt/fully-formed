import type { FormChild } from '../interfaces';
import type { IGroup } from '../../groups';
import type { IAdapter } from '../../adapters';

export type FormMembers = {
  fields: readonly FormChild[];
  groups: readonly IGroup[];
  adapters: readonly IAdapter[];
};
