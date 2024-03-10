import type { Nameable, NameableObject } from '../../../shared';

export class NameableObjectFactory {
  public static createNameableObjectFromArray<
    T extends ReadonlyArray<Nameable<string>>,
  >(arr: T): NameableObject<T> {
    return arr.reduce((obj: Record<string, unknown>, item: T[number]) => {
      obj[item.name] = item;
      return obj;
    }, {}) as NameableObject<T>;
  }
}
