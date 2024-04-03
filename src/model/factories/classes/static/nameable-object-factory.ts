import type { Nameable, NameableObject } from '../../../shared';

/**
 * A static class which is responsible creating an object from an array of 
 * objects implementing the {@link Nameable} interface. The `name` property of
 * each item of the array becomes the key assigned to that item in the resultant
 * object.
 */
export class NameableObjectFactory {
  /**
   * Creates an object from an array of objects implementing the 
   * {@link Nameable} interface. The `name` property of each item of the array 
   * becomes the key assigned to that item in the resultant object.
   * 
   * @typeParam T - A readonly array of objects implementing the
   * {@link Nameable} interface.
   */
  public static createNameableObjectFromArray<
    T extends ReadonlyArray<Nameable<string>>,
  >(arr: T): NameableObject<T> {
    return arr.reduce((obj: Record<string, unknown>, item: T[number]) => {
      obj[item.name] = item;
      return obj;
    }, {}) as NameableObject<T>;
  }
}
