import type { Stateful } from './stateful.interface';
import type { ExcludableState } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormValue, AbstractForm } from '../../form-elements';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { GroupValue, AbstractGroup } from '../../groups';

/**
 * Represents an entity whose value may be excluded from a {@link FormValue}
 * and/or {@link GroupValue} object.
 *
 * @remarks
 * If `state.exclude` is true, its key and value will be removed from the
 * {@link FormValue} and/or {@link GroupValue} objects of any
 * {@link AbstractForm}s and or {@link AbstractGroup}s of which it is a member.
 * Additionally, while excluded, its validity will not affect the validity of
 * those classes.
 */
export interface Excludable extends Stateful<ExcludableState> {}
