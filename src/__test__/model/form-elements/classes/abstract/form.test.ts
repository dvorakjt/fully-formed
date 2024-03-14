import { describe, test, expect } from 'vitest';
import { ExcludableField, Field, FormFactory, FormTemplate } from '../../../../../model';

describe('Form', () => {
  test('Its id defaults to its name.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = [];
    }
    const TestForm = FormFactory.createForm(Template);
    const testForm = new TestForm();
    expect(testForm.name).toBe('TestForm');
    expect(testForm.id).toBe(testForm.name);
  });

  test('Its value consists of all included, non-transient fields.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({ name: 'firstName', defaultValue: 'Georg' }),
        new ExcludableField({ name: 'middleName', defaultValue: 'Christoph' }),
        new Field({ name: 'lastName', defaultValue: 'Bach' }),
      ];
    };
    const TestForm = FormFactory.createForm(Template);
    const testForm = new TestForm();
    expect(testForm.state.value).toStrictEqual({
      firstName: 'Georg',
      middleName: 'Christoph',
      lastName: 'Bach'
    });
  });

  test('Its value does not include any transient fields.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({ name: 'password', defaultValue: '' }),
        new Field({ name: 'confirmPassword', defaultValue: '', transient: true })
      ]
    };
    const TestForm = FormFactory.createForm(Template);
    const testForm = new TestForm();
    expect(testForm.state.value).toStrictEqual({
      password: ''
    });
  });

  test('Its value does not include the values of any excluded excludable fields.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({ name: 'primaryEmail', defaultValue: 'user@example.com' }),
        new ExcludableField({ name: 'secondaryEmail', defaultValue: '', excludeByDefault: true })
      ];
    };
    const TestForm = FormFactory.createForm(Template);
    const testForm = new TestForm();
    expect(testForm.state.value).toStrictEqual({
      primaryEmail: 'user@example.com'
    });
  });

  test('Its value includes the values of any included user-defined adapters.', () => { });
  test('Its value does not include the values of any excluded excludable adapters.', () => { });
  test('If any included fields are invalid, its validity is invalid.', () => { });
  test('If any groups are invalid, its validity is invalid.', () => { });
  test('If there is at least one pending field and no invalid fields or groups, its validity is pending.', () => { });
  test('If there is at least one pending group and no invalid fields or groups, its validity is pending.', () => { });
  test('If all fields and groups are valid, its validity is valid.', () => { });
  test('If its validity is invalid and it has an invalid message, that message is included the messages array of its state.', () => { });
  test('If its validity is pending and it has a pending message, that message is included in the messages array of its state.', () => { });
  test('If its validity is valid and it has a valid message, that message is included in the messages array of its state.', () => { });

});