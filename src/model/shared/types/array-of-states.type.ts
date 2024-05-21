import type { Stateful } from '../interfaces';

export type ArrayOfStates<T extends readonly Stateful[]> = {
  [K in keyof T]: T[K]['state'];
};
