import { PERSISTENCE_KEY_PREFIX } from '../../constants';

export function createPersistenceKey(key: string): string {
  return `${PERSISTENCE_KEY_PREFIX}:${key}`;
}
