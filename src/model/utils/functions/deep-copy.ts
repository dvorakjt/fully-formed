export function deepCopy<T>(object: T): T {
  if (object === null || typeof object !== 'object') return object;

  if (object instanceof Map) {
    const clone = new Map();
    for (const [key, value] of object.entries()) {
      clone.set(deepCopy(key), deepCopy(value));
    }
    return clone as T;
  }

  if (object instanceof Set) {
    const clone = new Set();
    for (const value of object.values()) {
      clone.add(deepCopy(value));
    }
    return clone as T;
  }

  if (Array.isArray(object))
    return object.map(element => deepCopy(element)) as T;

  const clone = Object.create(Object.getPrototypeOf(object));

  for (const key of Object.keys(object)) {
    clone[key] = deepCopy(object[key as keyof typeof object]);
  }

  return clone;
}
