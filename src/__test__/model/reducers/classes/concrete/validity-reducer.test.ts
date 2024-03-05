import { describe, test, expect } from 'vitest';
import { Validity, ValidityReducer } from '../../../../../model';

describe('ValidityReducer', () => {
  test('Its validity defaults to valid.', () => {
    const reducer = new ValidityReducer();
    expect(reducer.validity).toBe(Validity.Valid);
  });

  test('If at least one member is invalid and included, its validity is invalid.', () => {
    const reducer = new ValidityReducer();
    reducer.processMemberState('invalidMember', { validity: Validity.Invalid });
    reducer.processMemberState('pendingMember', { validity: Validity.Pending });
    reducer.processMemberState('validMember', { validity: Validity.Valid });
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('If at least one member is pending and included and no members are invalid and included, its validity is pending.', () => {
    const reducer = new ValidityReducer();
    reducer.processMemberState('invalidExcludedMember', {
      validity: Validity.Invalid,
      exclude: true,
    });
    reducer.processMemberState('pendingMember', { validity: Validity.Pending });
    reducer.processMemberState('validMember', { validity: Validity.Valid });
    expect(reducer.validity).toBe(Validity.Pending);
  });

  test('If no members are invalid or pending and included, its validity is valid.', () => {
    const reducer = new ValidityReducer();
    reducer.processMemberState('invalidExcludedMember', {
      validity: Validity.Invalid,
      exclude: true,
    });
    reducer.processMemberState('pendingExcludedMember', {
      validity: Validity.Pending,
      exclude: true,
    });
    reducer.processMemberState('validMember', { validity: Validity.Valid });
    expect(reducer.validity).toBe(Validity.Valid);
  });
});
