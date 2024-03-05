import { describe, test } from 'vitest';

describe('FormReducer', () => {
  test('Its value contains the values of all included adapters.', () => {});
  test('Its value does not contain the values of any excluded adapters.', () => {});
  test('Its validity is invalid if any included adapters are invalid.', () => {});
  test('Its validity is invalid if any included transient form elements are invalid.', () => {});
  test('Its validity is invalid if any groups are invalid.', () => {});
  test('Its validity is pending if all included adapters, included transient fields, and groups are either valid or pending.', () => {});
  test('Its validity is valid if all included adapters, included transient fields, and groups are valid.', () => {});
  test('When the value of an adapter changes, its value is updated.', () => {});
  test('When the exclude property an adapter changes, its value is updated.', () => {});
  test('When the validity of an adapter changes, its validity is updated.', () => {});
  test('When the exclude property an adapter changes changes, its validity is updated.', () => {});
  test('When the validity of a transient form element changes, its validity is updated.', () => {});
  test('When the exclude property of a transient form element changes, its validity is updated.', () => {});
  test('When the validity of a group changes, its validity is updated.', () => {});
  test('When its state changes, it emits the new state to subscribers.', () => {});
});
