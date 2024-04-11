import { describe, test, expect } from 'vitest';
import { joinClassNames } from '../../../components';

describe('joinClassNames', () => {
  test('If it receives no arguments, it returns an empty string.', () => {
    expect(joinClassNames()).toBe('');
  });

  test('If it receives only undefined arguments, it returns an empty string.', () => {
    expect(joinClassNames(undefined, undefined, undefined)).toBe('');
  });

  test('If it receives multiple empty strings, it returns an empty string.', () => {
    expect(joinClassNames('', '', '')).toBe('');
  });

  test('It joins any non empty strings it receives, using a space character as a separator.', () => {
    const classNames = ['classA', 'classB', 'classC'];
    expect(joinClassNames(...classNames)).toBe('classA classB classC');
  });

  test('It filters out undefined class arguments and joins all remaining non-empty strings.', () => {
    const classNames = ['classA', undefined, 'classC'];
    expect(joinClassNames(...classNames)).toBe('classA classC');
  });

  test('It filters out empty strings and joins all remaining strings.', () => {
    const classNames = ['classA', '', 'classC'];
    expect(joinClassNames(...classNames)).toBe('classA classC');
  });
});
