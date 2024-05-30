export function deepEquals(a: unknown, b: unknown): boolean {
  if (typeof a === 'function') {
    return typeof b === 'function' && a.toString() === b.toString();
  }

  if (a instanceof Date) {
    return b instanceof Date && a.getTime() === b.getTime();
  }

  if (a instanceof RegExp) {
    return b instanceof RegExp && a.toString() === b.toString();
  }

  if (Array.isArray(a)) {
    return Array.isArray(b) && deepEqualsArray(a, b);
  }

  if (isObject(a) && isObject(b)) {
    return deepEqualsObject(a, b);
  }

  return a === b;
}

function deepEqualsArray(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (!deepEquals(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

function isObject(x: unknown): x is object {
  return typeof x === 'object' && x !== null;
}

function deepEqualsObject(a: object, b: object): boolean {
  const entriesA = Object.entries(a);
  const entriesB = Object.entries(b);

  if (entriesA.length !== entriesB.length) return false;

  // sort entries by key
  entriesA.sort((x, y) => x[0].localeCompare(y[0]));
  entriesB.sort((x, y) => x[0].localeCompare(y[0]));

  // compare keys and primitive values
  // objects are added to an array and will be compared
  // later
  const objectsToCompare = [];

  for (let i = 0; i < entriesA.length; i++) {
    const keyA = entriesA[i][0];
    const keyB = entriesB[i][0];

    if (keyA !== keyB) return false;

    const valueA = entriesA[i][1];
    const valueB = entriesB[i][1];

    if (typeof valueA === 'object' || typeof valueB === 'object') {
      objectsToCompare.push([valueA, valueB]);
    } else if (valueA !== valueB) {
      return false;
    }
  }

  // perform deep equals on objects
  for (const pair of objectsToCompare) {
    if (!deepEquals(pair[0], pair[1])) {
      return false;
    }
  }

  return true;
}
