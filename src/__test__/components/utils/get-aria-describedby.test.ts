import { describe, test, expect } from 'vitest';
import {
  getAriaDescribedBy,
  getMessagesContainerId,
} from '../../../components';

describe('getAriaDescribedBy()', () => {
  test(`It returns the result of calling getMessagesContainerId() if only a 
  field id is provided as an argument.`, () => {
    const fieldId = 'test-field';
    expect(getAriaDescribedBy(fieldId)).toBe(getMessagesContainerId(fieldId));
  });

  test(`If an empty string is provided as the second argument, it returns the 
  result of calling getMessagesContainerId() with the provided field id.`, () => {
    const fieldId = 'test-field';
    expect(getAriaDescribedBy(fieldId, '')).toBe(
      getMessagesContainerId(fieldId),
    );
  });

  test(`If a non-empty string is provided as the second argument, it returns 
  the result of calling getMessagesContainerId() with the provided field id 
  concatenated with a space and the second argument.`, () => {
    const fieldId = 'test-field';
    const ariaDescribedBy = 'some-id some-other-id';
    expect(getAriaDescribedBy(fieldId, ariaDescribedBy)).toBe(
      `${getMessagesContainerId(fieldId)} ${ariaDescribedBy}`,
    );
  });
});
