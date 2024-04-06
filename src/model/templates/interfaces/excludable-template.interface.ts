/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FormTemplate } from "../classes";
import type { FormFactory } from "../../factories";

/**
 * An interface that may be implemented by a class extending 
 * {@link FormTemplate} in order to specify whether a class created with the 
 * `createExcludableSubForm()` method of the {@link FormFactory} class should be
 * excluded by default.
 */
export interface ExcludableTemplate {
  excludeByDefault: boolean;
}
