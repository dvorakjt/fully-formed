import { describe, test, expect } from 'vitest';
import { Utils } from '../../../../../utils';
import { Validity } from '../../../../../model';

describe('Utils.reduceValidity()', () => {
  test('It returns Validity.Valid if it receives no arguments.', () => {
    const validity = Utils.reduceValidity();
    expect(validity).toBe(Validity.Valid);
  });

  test(`It returns Validity.Invalid if at least one of its arguments is 
  Validity.Invalid.`, () => {
    const validity = Utils.reduceValidity(
      Validity.Valid,
      Validity.Pending,
      Validity.Invalid,
    );
    expect(validity).toBe(Validity.Invalid);
  });

  test(`It returns Validity.Pending if at least one of its arguments is 
  Validity.Pending and none of its arguments are Validity.Invalid.`, () => {
    const validity = Utils.reduceValidity(Validity.Valid, Validity.Pending);
    expect(validity).toBe(Validity.Pending);
  });

  test(`It returns Validity.Valid if all of its are arguments are 
  Validity.Valid.`, () => {
    const validity = Utils.reduceValidity(Validity.Valid);
    expect(validity).toBe(Validity.Valid);
  });
});
