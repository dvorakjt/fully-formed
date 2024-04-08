/* eslint-disable @typescript-eslint/no-unused-vars */
import type { 
  FormElement, 
  FormValue,
  AbstractForm
} from "../../form-elements";
import type { 
  AbstractGroup,
  GroupValue 
} from "../../groups";
import type { Excludable } from "./excludable.interface";

/**
 * Represents a {@link FormElement} that may be transient.
 * 
 * @typeParam Transient - A boolean value representing whether or not the class
 * implementing this interface should be transient.
 * 
 * @remarks
 * The value of a transient {@link FormElement} is never included in a
 * {@link FormValue} object. However, its value IS included in 
 * {@link GroupValue} objects, and its validity does affect those of both
 * {@link AbstractForm}s and {@link AbstractGroup}s of which it is a member.
 * 
 * If a class implementing this interface also happens to implement
 * {@link Excludable}, toggling the `state.exclude` property of said class
 * will work differently for {@link AbstractForm}s and {@link AbstractGroup}s 
 * of which it is a member: 
 * - Toggling the `state.exclude` property of such a class will change
 * whether its validity affects that of a parent {@link AbstractForm}, but its
 * value will never be included in a {@link FormValue} object.
 * - Toggling the `state.exclude` property of such a class will change
 * whether its validity affects that of an {@link AbstractGroup} of which it is
 * a member, AND whether its value is included in that group's 
 * {@link GroupValue} object.
 * 
 */
export interface PossiblyTransient<Transient extends boolean> {
  transient: Transient;
}
