import { vi } from 'vitest';
import type { IAsyncValidator } from '../model';

export class MockAsyncValidator<T> implements IAsyncValidator<T> {
  public validate = vi.fn();
}
