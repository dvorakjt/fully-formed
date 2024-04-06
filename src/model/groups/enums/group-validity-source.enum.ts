// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AbstractGroup } from '../classes';

/**
 * Used to indicate how an {@link AbstractGroup}'s validity was determined. If
 * any of the groups members are not valid, the validity source of the group
 * will be `GroupValiditySource.Reduction`, otherwise, it will be
 * `GroupValiditySource.Validation`.
 *
 * @remarks
 * This property can be used to updated the UI differently depending on how
 * a group was determined to be non-valid. For instance, you may want to
 * highlight all of the `<input>` elements controlled by fields within a group
 * when group validation fails, but only individual `<input>` elements prior to
 * the execution of group validators.
 */
export enum GroupValiditySource {
  Reduction = 'reduction',
  Validation = 'validation',
}
