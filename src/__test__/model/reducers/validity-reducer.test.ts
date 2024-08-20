import { describe, test, expect } from 'vitest';
import {
  ValidityReducer,
  Validity,
  type ValidityReducerMember,
} from '../../../model';

describe('ValidityReducer', () => {
  test(`Upon instantiation, if at least one included member's validity is 
  invalid, its validity is invalid.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'invalidField', state: { validity: Validity.Invalid } },
      { name: 'pendingField', state: { validity: Validity.Pending } },
      { name: 'validField', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });

    expect(validityReducer.validity).toBe(Validity.Invalid);
  });

  test(`Upon instantiation, if all included members are either pending, 
  cautioned, or valid, its validity is pending.`, () => {
    const members: ValidityReducerMember[] = [
      {
        name: 'invalidField',
        state: { validity: Validity.Invalid, exclude: true },
      },
      { name: 'pendingField', state: { validity: Validity.Pending } },
      { name: 'cautionedField', state: { validity: Validity.Caution } },
      { name: 'validField', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });

    expect(validityReducer.validity).toBe(Validity.Pending);
  });

  test(`Upon instantiation, if all included members are either cautioned or 
  valid, its validity is Caution.`, () => {
    const members: ValidityReducerMember[] = [
      {
        name: 'invalidField',
        state: { validity: Validity.Invalid, exclude: true },
      },
      {
        name: 'pendingField',
        state: { validity: Validity.Pending, exclude: true },
      },
      { name: 'cautionedField', state: { validity: Validity.Caution } },
      { name: 'validField', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });

    expect(validityReducer.validity).toBe(Validity.Caution);
  });

  test(`Upon instantiation, if all included members are valid, its validity is 
  valid.`, () => {
    const members: ValidityReducerMember[] = [
      {
        name: 'invalidField',
        state: { validity: Validity.Invalid, exclude: true },
      },
      {
        name: 'pendingField',
        state: { validity: Validity.Pending, exclude: true },
      },
      { name: 'validField', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });

    expect(validityReducer.validity).toBe(Validity.Valid);
  });

  test('Upon instantiation, if no members are included, its validity is valid.', () => {
    const members: ValidityReducerMember[] = [
      {
        name: 'invalidField',
        state: { validity: Validity.Invalid, exclude: true },
      },
      {
        name: 'pendingField',
        state: { validity: Validity.Pending, exclude: true },
      },
      {
        name: 'validField',
        state: { validity: Validity.Valid, exclude: true },
      },
    ];

    const validityReducer = new ValidityReducer({ members });

    expect(validityReducer.validity).toBe(Validity.Valid);
  });

  test('Upon instantiation, if there are no members, its validity is valid.', () => {
    const validityReducer = new ValidityReducer({ members: [] });
    expect(validityReducer.validity).toBe(Validity.Valid);
  });

  test(`When processMemberStateUpdate() is called and a member becomes invalid, 
  its validity becomes invalid.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Valid } },
      { name: 'fieldB', state: { validity: Validity.Pending } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Pending);

    members[0].state.validity = Validity.Invalid;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Invalid);
  });

  test(`When processMemberStateUpdate() is called and the sole invalid member 
  becomes valid while all other members are either pending, cautioned, or valid, 
  its validity becomes pending.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Invalid } },
      { name: 'fieldB', state: { validity: Validity.Pending } },
      { name: 'fieldC', state: { validity: Validity.Caution } },
      { name: 'fieldD', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Invalid);

    members[0].state.validity = Validity.Valid;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Pending);
  });

  test(`When processMemberStateUpdate() is called and the sole invalid member 
  becomes pending while all other members are cautioned or valid, its validity 
  becomes pending.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Invalid } },
      { name: 'fieldB', state: { validity: Validity.Caution } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Invalid);

    members[0].state.validity = Validity.Pending;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Pending);
  });

  test(`When processMemberStateUpdate() is called and the sole invalid member 
  becomes cautioned while all other members are cautioned or valid, its validity 
  becomes Caution.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Invalid } },
      { name: 'fieldB', state: { validity: Validity.Caution } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Invalid);

    members[0].state.validity = Validity.Caution;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Caution);
  });

  test(`When processMemberStateUpdate() is called and the sole pending member 
  becomes cautioned while all other members are cautioned or valid, its 
  validity becomes Caution.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Pending } },
      { name: 'fieldB', state: { validity: Validity.Caution } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Pending);

    members[0].state.validity = Validity.Caution;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Caution);
  });

  test(`When processMemberStateUpdate() is called and the sole invalid member 
  becomes valid while all other members are valid, its validity becomes 
  valid.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Invalid } },
      { name: 'fieldB', state: { validity: Validity.Valid } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Invalid);

    members[0].state.validity = Validity.Valid;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Valid);
  });

  test(`When processMemberStateUpdate() is called and the sole pending member 
  becomes valid while all other members are valid, its validity becomes valid.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Pending } },
      { name: 'fieldB', state: { validity: Validity.Valid } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Pending);

    members[0].state.validity = Validity.Valid;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Valid);
  });

  test(`When processMemberStateUpdate() is called and a previously excluded 
  invalid member becomes included, its validity becomes invalid.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Invalid, exclude: true } },
      { name: 'fieldB', state: { validity: Validity.Pending } },
      { name: 'fieldC', state: { validity: Validity.Caution } },
      { name: 'fieldD', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Pending);

    members[0].state.exclude = false;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Invalid);
  });

  test(`When processMemberStateUpdate() is called and the sole invalid member 
  becomes excluded while all other members are either pending, cautioned or 
  valid, its validity becomes pending.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Invalid, exclude: false } },
      { name: 'fieldB', state: { validity: Validity.Pending } },
      { name: 'fieldC', state: { validity: Validity.Caution } },
      { name: 'fieldD', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Invalid);

    members[0].state.exclude = true;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Pending);
  });

  test(`When processMemberStateUpdate() is called and the sole invalid member 
  becomes excluded while all other members are cautioned or valid, its validity 
  becomes Caution.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Invalid, exclude: false } },
      { name: 'fieldB', state: { validity: Validity.Caution } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Invalid);

    members[0].state.exclude = true;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Caution);
  });

  test(`When processMemberStateUpdate() is called and the sole pending member 
  becomes excluded while all other members are cautioned or valid, its validity 
  becomes Caution.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Pending, exclude: false } },
      { name: 'fieldB', state: { validity: Validity.Caution } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Pending);

    members[0].state.exclude = true;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Caution);
  });

  test(`When processMemberStateUpdate() is called and the sole invalid member 
  becomes excluded while all other members are valid, its validity becomes 
  valid.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Invalid, exclude: false } },
      { name: 'fieldB', state: { validity: Validity.Valid } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Invalid);

    members[0].state.exclude = true;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Valid);
  });

  test(`When processMemberStateUpdate() is called and the sole pending member 
  becomes excluded while all other members are valid, its validity becomes 
  valid.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Pending, exclude: false } },
      { name: 'fieldB', state: { validity: Validity.Valid } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Pending);

    members[0].state.exclude = true;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Valid);
  });

  test(`When processMemberStateUpdate() is called and the sole cautioned member 
  becomes excluded while all other members are valid, its validity becomes 
  valid.`, () => {
    const members: ValidityReducerMember[] = [
      { name: 'fieldA', state: { validity: Validity.Caution, exclude: false } },
      { name: 'fieldB', state: { validity: Validity.Valid } },
      { name: 'fieldC', state: { validity: Validity.Valid } },
    ];

    const validityReducer = new ValidityReducer({ members });
    expect(validityReducer.validity).toBe(Validity.Caution);

    members[0].state.exclude = true;
    validityReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(validityReducer.validity).toBe(Validity.Valid);
  });
});
