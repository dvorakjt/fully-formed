import { describe, test, expect } from 'vitest';
import { getLegendId } from '../../../components';

describe('getLegendId()', () => {
  test('It appends -legend to the formElementId it receives.', () => {
    expect(getLegendId('test')).toBe('test-legend');
  });
});
