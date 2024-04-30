import { describe, test, expect } from 'vitest';
import { getAriaInvalid } from '../../../components';
import { Validity, type FieldState } from '../../../model';

describe('getAriaInvalid()', () => {
  test(`It returns true if the validity property of the field state it 
  receives is Validity.Invalid and the visited property is true.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Invalid,
      messages: [],
      visited: true,
      modified: false,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, false, Validity.Valid)).toBe(true);
  });

  test(`It returns true if the groupValidity it receives is Validity.Invalid 
  and the visited property of the field state it receives is true.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      visited: true,
      modified: false,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, false, Validity.Invalid)).toBe(true);
  });

  test(`It returns true if the validity property of the field state it 
  receives is Validity.Invalid and the modified property is true.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Invalid,
      messages: [],
      visited: false,
      modified: true,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, false, Validity.Valid)).toBe(true);
  });

  test(`It returns true if the groupValidity it receives is Validity.Invalid 
  and the modified property of the field state it receives is true.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      visited: false,
      modified: true,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, false, Validity.Invalid)).toBe(true);
  });

  test(`It returns true if the validity property of the field state it 
  receives is Validity.Invalid and confirmationAttempted is true.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Invalid,
      messages: [],
      visited: false,
      modified: false,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, true, Validity.Valid)).toBe(true);
  });

  test(`It returns true if the groupValidity it receives is Validity.Invalid 
  and confirmationAttempted is true.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      visited: false,
      modified: false,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, true, Validity.Invalid)).toBe(true);
  });

  test(`It returns true if the validity property of the field state it 
  receives is Validity.Invalid and the visited property is true.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Invalid,
      messages: [],
      visited: true,
      modified: false,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, false, Validity.Valid)).toBe(true);
  });

  test(`It returns false if confirmationAttempted and the visited and modified 
  properties of the fieldState it received are all false, even if the validity 
  of the field is Validity.Invalid.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Invalid,
      messages: [],
      visited: false,
      modified: false,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, false, Validity.Valid)).toBe(false);
  });

  test(`It returns false if confirmationAttempted and the visited and modified 
  properties of the fieldState it received are all false, even if the 
  groupValidity it received is Validity.Invalid.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      visited: false,
      modified: false,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, false, Validity.Invalid)).toBe(false);
  });

  test(`It returns false if both the validity property of the fieldState and 
  the groupValidity are Validity.Valid, even if the visited property of the 
  fieldState is true.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      visited: true,
      modified: false,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, false, Validity.Valid)).toBe(false);
  });

  test(`It returns false if both the validity property of the fieldState and 
  the groupValidity are Validity.Valid, even if the modified property of the 
  fieldState is true.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      visited: false,
      modified: true,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, false, Validity.Valid)).toBe(false);
  });

  test(`It returns false if both the validity property of the fieldState and 
  the groupValidity are Validity.Valid, even if confirmationAttempted is true.`, () => {
    const fieldState: FieldState<string> = {
      value: '',
      validity: Validity.Valid,
      messages: [],
      visited: false,
      modified: false,
      focused: false,
    };
    expect(getAriaInvalid(fieldState, true, Validity.Valid)).toBe(false);
  });
});
