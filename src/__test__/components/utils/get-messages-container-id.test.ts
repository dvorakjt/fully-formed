import { describe, test, expect } from 'vitest';
import { getMessagesContainerId } from '../../../components';

describe('getMessagesContainerId', () => {
  test('It appends "-messages" to the id it receives.', () => {
    const testId = 'test-field';
    expect(getMessagesContainerId(testId)).toBe(testId + '-messages');
  });
});
