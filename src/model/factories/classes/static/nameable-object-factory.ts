import type { Nameable, NameableObject } from '../../../shared';

/**
 * A static class which is responsible for creating an object from an array of
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
   *
   * @param arr - A readonly array of objects implementing the
   * {@link Nameable} interface.
   *
   * @returns An object whose key-value pairs consist of the `name` property
   * of each item in the array it received mapped to that item.
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
