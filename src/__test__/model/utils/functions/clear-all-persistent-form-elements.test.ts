import { describe, test, expect } from 'vitest';
import {
  clearAllPersistentFormElements,
  createPersistenceKey,
} from '../../../../model';

describe('clearAllPersistentFormElements', () => {
  test(`It clears the values of all persistent form elements from session 
  storage without removing other values.`, () => {
    const keyValuePairs = [
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3'],
    ];

    const persistentFormElementKVPairs = keyValuePairs.map(([k, v]) => {
      return [createPersistenceKey(k), v];
    });

    for (const [key, value] of keyValuePairs) {
      sessionStorage.setItem(key, value);
    }

    for (const [key, value] of persistentFormElementKVPairs) {
      sessionStorage.setItem(key, value);
    }

    for (const [key, value] of keyValuePairs) {
      expect(sessionStorage.getItem(key)).toBe(value);
    }

    for (const [key, value] of persistentFormElementKVPairs) {
      expect(sessionStorage.getItem(key)).toBe(value);
    }

    clearAllPersistentFormElements();

    for (const [key] of persistentFormElementKVPairs) {
      expect(sessionStorage.getItem(key)).toBe(null);
    }

    for (const [key, value] of keyValuePairs) {
      expect(sessionStorage.getItem(key)).toBe(value);
    }
  });
});
