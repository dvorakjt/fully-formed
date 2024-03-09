import { describe, test, expect } from 'vitest';
import {
  Adapter,
  Group,
  Field,
  DefaultAdapter,
  FormReducer,
  ExcludableField,
} from '../../../../../model';
import { DefaultExcludableAdapter } from '../../../../../model/adapters/classes/concrete/default-excludable-adapter';

describe('FormReducer', () => {
  test('Its value contains the values of all included adapters.', () => {
    const firstName = new Field({
      name: 'firstName',
      defaultValue: 'Lili',
      transient: true,
    });
    const lastName = new Field({
      name: 'lastName',
      defaultValue: 'Boulanger',
      transient: true,
    });
    const occupation = new Field({
      name: 'occupation',
      defaultValue: 'composer',
    });
    const occupationAdapter = new DefaultAdapter({ source: occupation });
    const fullNameGroup = new Group({
      name: 'fullName',
      members: [firstName, lastName],
    });
    const fullNameAdapter = new Adapter({
      name: 'fullName',
      source: fullNameGroup,
      adaptFn: ({ value }): string => {
        return `${value.lastName}, ${value.firstName}`;
      },
    });
    const formElements = [firstName, lastName, occupation] as const;
    const userDefinedAdapters = [fullNameAdapter] as const;
    const reducer = new FormReducer<
      typeof formElements,
      typeof userDefinedAdapters
    >({
      adapters: [occupationAdapter, fullNameAdapter],
      transientFormElements: [firstName, lastName],
      groups: [fullNameGroup],
    });

    expect(reducer.state.value).toStrictEqual({
      fullName: 'Boulanger, Lili',
      occupation: 'composer',
    });
  });

  test('Its value does not contain the values of any excluded adapters.', () => {
    const firstName = new Field({ name: 'firstName', defaultValue: 'Clara' });
    const lastName = new Field({ name: 'lastName', defaultValue: 'Schumann' });
    const middleName = new ExcludableField({
      name: 'middleName',
      defaultValue: 'Josephine',
      excludeByDefault: true,
    });
    const formElements = [firstName, lastName, middleName] as const;
    const reducer = new FormReducer<typeof formElements, []>({
      adapters: [
        new DefaultAdapter({ source: firstName }),
        new DefaultExcludableAdapter({ source: middleName }),
        new DefaultAdapter({ source: lastName }),
      ],
      transientFormElements: [],
      groups: [],
    });
    expect(reducer.state.value).toStrictEqual({
      firstName: 'Clara',
      lastName: 'Schumann',
    });
  });

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
