import { useRef } from 'react';
import type { AbstractForm, FormConstituents } from '../model';

export function useForm<T extends AbstractForm<string, FormConstituents>>(
  form: T,
): T {
  return useRef(form).current;
}
