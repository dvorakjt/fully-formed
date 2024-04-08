/**
 * Represents an entity that should be uniquely named amongst related entities.
 * 
 * @typeParam Name - A string literal which will be used to uniquely identify
 * a class implementing this interface.
 */
export interface Nameable<Name extends string> {
  name: Name;
}
