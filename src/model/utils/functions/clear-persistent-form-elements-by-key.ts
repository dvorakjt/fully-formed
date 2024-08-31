import { createPersistenceKey } from './create-persistence-key';

export function clearPersistentFormElementsByKey(keys: string[]): void {
  for (const key of keys) {
    sessionStorage.removeItem(createPersistenceKey(key));
  }
}
