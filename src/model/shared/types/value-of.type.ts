import type { Validated } from '../interfaces';

export type ValueOf<T extends Validated<unknown>> = T['state']['value'];
