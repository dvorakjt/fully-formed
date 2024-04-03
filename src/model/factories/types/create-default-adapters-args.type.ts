import type { AutoTrim, FormElement } from "../../form-elements";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DefaultAdapterFactory } from "../classes";

/**
 * An object provided as an argument to the `createDefaultAdapters` method of 
 * the {@link DefaultAdapterFactory} class.
 */
export type CreateDefaultAdaptersArgs = {
  formElements: readonly FormElement[];
  autoTrim: AutoTrim;
};