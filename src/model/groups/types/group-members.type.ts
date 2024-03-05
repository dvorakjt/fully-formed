import type { FormElement } from '../../form-elements';
import type { AbstractGroup } from '../classes';

export type GroupMember = FormElement | AbstractGroup<string, GroupMembers>;
export type GroupMembers = readonly GroupMember[];
