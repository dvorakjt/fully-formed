import { describe, test, expect } from 'vitest';
import { getFieldMessagesContainerId } from '../../../components';

describe('getFieldMessagesContainerId', () => {
  test('It appends "-messages" to the field id it receives.', () => {
    const testId = 'test-field';
    expect(getFieldMessagesContainerId(testId)).toBe(testId + '-messages');
  });
});
