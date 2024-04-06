import type { Excludable } from '../../shared';
import type { GroupMembers } from './group-members.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormElement } from '../../form-elements';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AbstractGroup } from '../classes';

/**
 * Filters out excludable members and returns an object whose keys are the names
 * of the remaining members and whose values are the types of values that
 * each of those members holds.
 */
export type NonExcludableMemberValues<Members extends GroupMembers> = {
  [M in Members[number] as M extends Excludable ? never
  : M['name']]: M['state']['value'];
};

/**
 * Filters out non-excludable members and returns an object whose keys are the
 * names of the remaining members and whose values are the types of values that
 * each of those members holds, or `undefined`.
 */
export type ExcludableMemberValues<Members extends GroupMembers> = {
  [M in Members[number] as M extends Excludable ? M['name']
  : never]+?: M['state']['value'];
};

/**
 * Produces an object whose keys consist of the names of all members, and whose
 * values are the types of values that the members contain, or `undefined` for
 * excludable members.
 *
 * @typeParam Members - A readonly array of {@link FormElement}s and/or
 * {@link AbstractGroup}s.
 */
export type GroupValue<Members extends GroupMembers> =
  NonExcludableMemberValues<Members> & ExcludableMemberValues<Members>;
