import { useRef } from 'react';
import type { IForm } from '../model';

export function useForm<T extends IForm>(form: T): T {
  return useRef(form).current;
}
