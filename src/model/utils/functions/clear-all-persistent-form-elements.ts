import { PERSISTENCE_KEY_PREFIX } from '../../constants';

export function clearAllPersistentFormElements(): void {
  const keys = Object.keys(sessionStorage);
  for (const key of keys) {
    if (key.startsWith(PERSISTENCE_KEY_PREFIX)) {
      sessionStorage.removeItem(key);
    }
  }
}
