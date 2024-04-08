/**
 * The state of an entity that will be represented in the UI with an 
 * HTML element that may receive user input.
 * 
 * @remarks
 * - `focused` will be `true` if corresponding HTML element has received focus 
 * at least once. 
 * - `visited` will be `true` if the corresponding HTML element has received 
 * focus and then lost focus at least once.
 * - `modified` will be `true` if the value of the corresponding HTML element 
 * has been changed at least once.
 */
export type InteractableState = {
  focused: boolean;
  visited: boolean;
  modified: boolean;
};
