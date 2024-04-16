import { useRef } from 'react';
import type { AbstractForm, FormConstituents } from '../model';

/**
 * Persists an instance of {@link AbstractForm} across component re-renders.
 *
 * @param form - An instance of {@link AbstractForm} to persist.
 *
 * @returns The persisted {@link AbstractForm} instance.
 */
export function useForm<T extends AbstractForm<string, FormConstituents>>(
  form: T,
): T {
  return useRef(form).current;
}
