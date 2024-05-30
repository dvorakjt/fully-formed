import { describe, test, expect } from 'vitest';
import { ExcludableField, Field, ValueReducer } from '../../../model';
import { ObjectIdMap } from '../../../test-utils';

describe('ValueReducer', () => {
  test(`Upon instantiation, its value is an object containing its members' 
  values and didValueChange is false.`, () => {
    const members = [
      new Field({ name: 'firstName', defaultValue: 'Julius' }),
      new Field({ name: 'lastName', defaultValue: 'Eastman' }),
    ];
    const valueReducer = new ValueReducer({ members });
    expect(valueReducer.state).toStrictEqual({
      value: {
        firstName: 'Julius',
        lastName: 'Eastman',
      },
      didValueChange: false,
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

    expect(valueReducer.state).toStrictEqual({
      value: {
        firstName: 'John',
        lastName: 'Adams',
      },
      didValueChange: false,
    });
  });

  test('When processMemberStateUpdate() is called, its value is updated.', () => {
    const members = [
      new Field({ name: 'firstName', defaultValue: 'John' }),
      new Field({ name: 'lastName', defaultValue: 'Adams' }),
    ] as const;
    const valueReducer = new ValueReducer({ members });

    expect(valueReducer.state).toStrictEqual({
      value: {
        firstName: 'John',
        lastName: 'Adams',
      },
      didValueChange: false,
    });

    members[0].setValue('Wednesday');

    valueReducer.processMemberStateUpdate(members[0].name, members[0].state);

    expect(valueReducer.state).toStrictEqual({
      value: {
        firstName: 'Wednesday',
        lastName: 'Adams',
      },
      didValueChange: true,
    });
  });

  test(`When processMemberStateUpdate() is called with a previously included 
  member that has become excluded, that member's value is removed from its 
  value.`, () => {
    const members = [
      new Field({ name: 'firstName', defaultValue: 'John' }),
      new Field({ name: 'lastName', defaultValue: 'Adams' }),
      new ExcludableField({ name: 'middleName', defaultValue: 'Quincy' }),
    ] as const;

    const valueReducer = new ValueReducer({ members });

    expect(valueReducer.state).toStrictEqual({
      value: {
        firstName: 'John',
        middleName: 'Quincy',
        lastName: 'Adams',
      },
      didValueChange: false,
    });

    members[2].setExclude(true);

    valueReducer.processMemberStateUpdate(members[2].name, members[2].state);

    expect(valueReducer.state).toStrictEqual({
      value: {
        firstName: 'John',
        lastName: 'Adams',
      },
      didValueChange: true,
    });
  });

  test(`When processMemberStateUpdate() is called with a previously excluded 
  member that has become included, that member's value is added to value.`, () => {
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

    expect(valueReducer.state).toStrictEqual({
      value: {
        firstName: 'John',
        lastName: 'Adams',
      },
      didValueChange: false,
    });

    members[2].setExclude(false);

    valueReducer.processMemberStateUpdate(members[2].name, members[2].state);

    expect(valueReducer.state).toStrictEqual({
      value: {
        firstName: 'John',
        middleName: 'Quincy',
        lastName: 'Adams',
      },
      didValueChange: true,
    });
  });

  test(`When processMemberStateUpdate() is called and the member's value has 
  not changed, the didValueChange property of its state becomes false.`, () => {
    const members = [
      new Field({ name: 'firstName', defaultValue: 'John' }),
      new Field({ name: 'lastName', defaultValue: 'Adams' }),
    ];

    const valueReducer = new ValueReducer({ members });

    members[0].setValue('Fester');
    valueReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(valueReducer.state.didValueChange).toBe(true);

    members[0].focus();
    valueReducer.processMemberStateUpdate(members[0].name, members[0].state);
    expect(valueReducer.state.didValueChange).toBe(false);
  });

  test(`When the value of a member is an object, that value is cloned before 
  being added to the reducer's value.`, () => {
    interface SomeObject {
      someProperty: string;
    }

    const objectTypeField = new Field({
      name: 'objectTypeField',
      defaultValue: { someProperty: '' },
    });

    const valueReducer = new ValueReducer<{ objectTypeField: SomeObject }>({
      members: [objectTypeField],
    });

    const objectIdMap = new ObjectIdMap();

    objectTypeField.setValue({ someProperty: 'test' });

    valueReducer.processMemberStateUpdate(
      'objectTypeField',
      objectTypeField.state,
    );

    expect(objectTypeField.state.value).toStrictEqual(
      valueReducer.state.value.objectTypeField,
    );

    const originalValueId = objectIdMap.get(objectTypeField.state.value);
    const clonedValueId = objectIdMap.get(
      valueReducer.state.value.objectTypeField,
    );

    expect(originalValueId).not.toBe(clonedValueId);
  });
});
