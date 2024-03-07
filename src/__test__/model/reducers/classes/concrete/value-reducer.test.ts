import { describe, test, expect } from 'vitest';
import { ExcludableField, Field, ValueReducer } from '../../../../../model';

describe('ValueReducer', () => {
  test("Upon instantiation, its value is initialized to an object containing its members' values.", () => {
    const members = [
      new Field({ name: 'firstName', defaultValue: 'Julius' }),
      new Field({ name: 'lastName', defaultValue: 'Eastman' }),
    ];
    const valueReducer = new ValueReducer({ members });
    expect(valueReducer.value).toStrictEqual({
      firstName: 'Julius',
      lastName: 'Eastman',
    });
  });

  test('Excluded members values are not included in its value.', () => {
    const members = [
      new Field({ name: 'firstName', defaultValue: 'John' }),
      new Field({ name: 'lastName', defaultValue: 'Adams' }),
      new ExcludableField({
        name: 'middleName',
        defaultValue: '',
        excludeByDefault: true,
      }),
    ];
    const valueReducer = new ValueReducer({ members });
    expect(valueReducer.value).toStrictEqual({
      firstName: 'John',
      lastName: 'Adams',
    });
  });

  test('When processMemberStateUpdate() is called, its value is updated.', () => {
    const members = [
      new Field({ name: 'firstName', defaultValue: 'John' }),
      new Field({ name: 'lastName', defaultValue: 'Adams' }),
    ] as const;
    const valueReducer = new ValueReducer({ members });
    expect(valueReducer.value).toStrictEqual({
      firstName: 'John',
      lastName: 'Adams',
    });

    members[0].setValue('Wednesday');
    valueReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(valueReducer.value).toStrictEqual({
      firstName: 'Wednesday',
      lastName: 'Adams',
    });
  });

  test("When processMemberStateUpdate() is called with a previously included member that has become excluded, that member's value is removed from its value.", () => {
    const members = [
      new Field({ name: 'firstName', defaultValue: 'John' }),
      new Field({ name: 'lastName', defaultValue: 'Adams' }),
      new ExcludableField({ name: 'middleName', defaultValue: 'Quincy' }),
    ] as const;
    const valueReducer = new ValueReducer({ members });
    expect(valueReducer.value).toStrictEqual({
      firstName: 'John',
      middleName: 'Quincy',
      lastName: 'Adams',
    });

    members[2].setExclude(true);
    valueReducer.processMemberStateUpdate(members[2].name, members[2].state);
    expect(valueReducer.value).toStrictEqual({
      firstName: 'John',
      lastName: 'Adams',
    });
  });

  test("When processMemberStateUpdate() is called with a previously excluded member that has become included, that member's value is added to value.", () => {
    const members = [
      new Field({ name: 'firstName', defaultValue: 'John' }),
      new Field({ name: 'lastName', defaultValue: 'Adams' }),
      new ExcludableField({
        name: 'middleName',
        defaultValue: 'Quincy',
        excludeByDefault: true,
      }),
    ] as const;
    const valueReducer = new ValueReducer({ members });
    expect(valueReducer.value).toStrictEqual({
      firstName: 'John',
      lastName: 'Adams',
    });

    members[2].setExclude(false);
    valueReducer.processMemberStateUpdate(members[2].name, members[2].state);
    expect(valueReducer.value).toStrictEqual({
      firstName: 'John',
      middleName: 'Quincy',
      lastName: 'Adams',
    });
  });
});
