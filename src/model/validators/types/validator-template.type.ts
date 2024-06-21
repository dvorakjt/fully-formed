import type { ValidatorConstructorParams } from '../classes/validator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Field } from '../../form-elements';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Group } from '../../groups';

/**
 * A template that can be provided to a {@link Field}, {@link Group}, etc. in
 * order to automatically instantiate validators for that entity.
 */
export type ValidatorTemplate<T> = ValidatorConstructorParams<T>;
