import { describe, test, expect } from 'vitest';
import { getDisabled } from '../../../components/utils';
import { Validity, type ExcludableFieldState } from '../../../model';

describe('getDisabled()', () => {
  test('It returns true if disabled is true.', () => {
    const fieldState: ExcludableFieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      focused: false,
      visited: false,
      modified: false,
      exclude: false,
    };
    expect(
      getDisabled({
        fieldState,
        disabled: true,
        disabledWhenExcluded: false,
      }),
    ).toBe(true);
  });

  test(`It returns true if disabledWhenExcluded is true and the exclude 
  property of the field state it receives is true.`, () => {
    const fieldState: ExcludableFieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      focused: false,
      visited: false,
      modified: false,
      exclude: true,
    };
    expect(
      getDisabled({
        fieldState,
        disabled: false,
        disabledWhenExcluded: true,
      }),
    ).toBe(true);
  });

  test(`It returns false if both disabled and disabledWhenExcluded are false.`, () => {
    const fieldState: ExcludableFieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      focused: false,
      visited: false,
      modified: false,
      exclude: false,
    };
    expect(
      getDisabled({
        fieldState,
        disabled: false,
        disabledWhenExcluded: false,
      }),
    ).toBe(false);
  });

  test(`It returns false if both disabled and disabledWhenExcluded are false, 
  even if the field is currently excluded.`, () => {
    const fieldState: ExcludableFieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      focused: false,
      visited: false,
      modified: false,
      exclude: true,
    };
    expect(
      getDisabled({
        fieldState,
        disabled: false,
        disabledWhenExcluded: false,
      }),
    ).toBe(false);
  });

  test(`It returns false if disabled is false and disabledWhenExcluded is true,
  but the exclude property of the fieldState it receives is false.`, () => {
    const fieldState: ExcludableFieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      focused: false,
      visited: false,
      modified: false,
      exclude: false,
    };
    expect(
      getDisabled({
        fieldState,
        disabled: false,
        disabledWhenExcluded: true,
      }),
    ).toBe(false);
  });
});
