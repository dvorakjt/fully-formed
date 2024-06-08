import { useRef } from 'react';
import type { IForm } from '../model';

/**
 * Accepts an instance of a class that implements {@link IForm} and returns that
 * instance. Ensures that the same instance of a form persists across
 * React re-renders.
 *
 * @param form - An instance of {@link IForm} that should persist across
 * re-renders.
 *
 * @returns The {@link IForm} instance.
 */
export function useForm<T extends IForm>(form: T): T {
  return useRef(form).current;
}
