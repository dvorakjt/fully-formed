import { describe, test, expect } from 'vitest';
import {
  GroupValiditySource,
  ValidityUtils,
  Validity,
  type InteractiveState,
} from '../../../model';

describe('Utils', () => {
  test(`Utils.isPristine() returns false when the isInFocus property of the 
  state it receives is true.`, () => {
    const state: InteractiveState = {
      isInFocus: true,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    };
    expect(ValidityUtils.isPristine(state)).toBe(false);
  });

  test(`Utils.isPristine() returns false when the hasBeenBlurred property of the 
  state it receives is true.`, () => {
    const state: InteractiveState = {
      isInFocus: false,
      hasBeenBlurred: true,
      hasBeenModified: false,
      submitted: false,
    };
    expect(ValidityUtils.isPristine(state)).toBe(false);
  });

  test(`Utils.isPristine() returns false when the hasBeenModified property of 
  the state it receives is true.`, () => {
    const state: InteractiveState = {
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: true,
      submitted: false,
    };
    expect(ValidityUtils.isPristine(state)).toBe(false);
  });

  test(`Utils.isPristine() returns false when the submitted property of the 
  state it receives is true.`, () => {
    const state: InteractiveState = {
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: true,
    };
    expect(ValidityUtils.isPristine(state)).toBe(false);
  });

  test(`Utils.isPristine() returns true when the state it receives is 
  pristine.`, () => {
    const state: InteractiveState = {
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    };
    expect(ValidityUtils.isPristine(state)).toBe(true);
  });

  test(`Utils.isClean() returns false when the hasBeenBlurred property of the 
  state it receives is true.`, () => {
    const state: InteractiveState = {
      isInFocus: false,
      hasBeenBlurred: true,
      hasBeenModified: false,
      submitted: false,
    };
    expect(ValidityUtils.isClean(state)).toBe(false);
  });

  test(`Utils.isClean() returns false when the hasBeenModified property of the 
  state it receives is true.`, () => {
    const state: InteractiveState = {
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: true,
      submitted: false,
    };
    expect(ValidityUtils.isClean(state)).toBe(false);
  });

  test(`Utils.isClean() returns false when the submitted property of the state 
  it receives is true.`, () => {
    const state: InteractiveState = {
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: true,
    };
    expect(ValidityUtils.isClean(state)).toBe(false);
  });

  test(`Utils.isClean() returns true when the state it receives is clean.`, () => {
    const state: InteractiveState = {
      isInFocus: true,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    };
    expect(ValidityUtils.isClean(state)).toBe(true);
  });

  test(`Utils.isClean() returns true when the state it receives is 
  pristine.`, () => {
    const state: InteractiveState = {
      isInFocus: false,
      hasBeenBlurred: false,
      hasBeenModified: false,
      submitted: false,
    };
    expect(ValidityUtils.isClean(state)).toBe(true);
  });

  test(`Utils.reduceStatesToValidity() returns Validity.Invalid if any of the 
  states it receives is invalid.`, () => {
    const states = [
      {
        value: '',
        validity: Validity.Valid,
      },
      {
        value: '',
        validity: Validity.Pending,
      },
      {
        value: '',
        validity: Validity.Invalid,
      },
    ];

    expect(ValidityUtils.reduceStatesToValidity(states)).toBe(Validity.Invalid);
  });

  test(`Utils.reduceStatesToValidity() returns Validity.Pending if any of the 
  states it receives is pending and none are invalid.`, () => {
    const states = [
      {
        value: '',
        validity: Validity.Valid,
      },
      {
        value: '',
        validity: Validity.Pending,
      },
    ];

    expect(ValidityUtils.reduceStatesToValidity(states)).toBe(Validity.Pending);
  });

  test(`Utils.reduceStatesToValidity() returns Validity.Valid if all of the 
  states it receives are valid.`, () => {
    const states = [
      {
        value: '',
        validity: Validity.Valid,
      },
    ];

    expect(ValidityUtils.reduceStatesToValidity(states)).toBe(Validity.Valid);
  });

  test(`Utils.reduceStatesToValidity() returns Validity.Valid if it receives 
  an empty array.`, () => {
    expect(ValidityUtils.reduceStatesToValidity([])).toBe(Validity.Valid);
  });

  test(`Utils.reduceStatesToValidity() removes states with a validitySource of 
  GroupValiditySource.Reduction if pruneUnvalidatedGroupStates is true.`, () => {
    const states = [
      {
        value: '',
        validity: Validity.Valid,
      },
      {
        value: {
          fieldA: '',
          fieldB: '',
        },
        validity: Validity.Invalid,
        validitySource: GroupValiditySource.Reduction,
      },
    ];

    expect(
      ValidityUtils.reduceStatesToValidity(states, {
        pruneUnvalidatedGroupStates: true,
      }),
    ).toBe(Validity.Valid);
  });
});
