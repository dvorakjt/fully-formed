import type { Validity } from '../enums';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ValidatorSuite } from '../../validators';

/**
 * A message intended to be displayed to the end user.
 *
 * @remarks
 * Because the validators contained in a {@link ValidatorSuite} may return a variety of results, each `Message` includes a validity property, facilitating the application of appropriate styles and/or CSS classes to the corresponding UI component.
 */
export type Message = {
  text: string;
  validity: Validity;
};
