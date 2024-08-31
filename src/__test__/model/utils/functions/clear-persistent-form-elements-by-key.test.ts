import { describe, test, expect } from 'vitest';
import {
  createPersistenceKey,
  clearPersistentFormElementsByKey,
} from '../../../../model';

describe('clearPersistentFormElementsByKey', () => {
  test('It clears only the keys it receives.', () => {
    const formElementKeysToClear = [
      'key to clear 1',
      'key to clear 2',
      'key to clear 3',
    ];

    const formElementKeysToPreserve = [
      'preserved key 1',
      'preserved key 2',
      'preserved key 3',
    ];

    const otherKeys = [
      'item not set by fully formed 1',
      'item not set by fully formed 2',
      'item not set by fully formed 3',
    ];

    for (const key of formElementKeysToClear) {
      sessionStorage.setItem(createPersistenceKey(key), '');
    }

    for (const key of formElementKeysToPreserve) {
      sessionStorage.setItem(createPersistenceKey(key), '');
    }

    for (const key of otherKeys) {
      sessionStorage.setItem(key, '');
    }

    clearPersistentFormElementsByKey(formElementKeysToClear);

    for (const key of formElementKeysToClear) {
      expect(sessionStorage.getItem(createPersistenceKey(key))).toBeNull();
    }

    for (const key of formElementKeysToPreserve) {
      expect(sessionStorage.getItem(createPersistenceKey(key))).not.toBeNull();
      sessionStorage.removeItem(createPersistenceKey(key));
    }

    for (const key of otherKeys) {
      expect(sessionStorage.getItem(key)).not.toBeNull();
      sessionStorage.removeItem(key);
    }
  });
});
