/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { describe, test, expect, vi } from 'vitest';
import {
  ExcludableField,
  Field,
  FormFactory,
  FormTemplate,
  Adapter,
  ExcludableAdapter,
  StringValidators,
  Validity,
  Group,
  GroupValiditySource,
  AsyncValidator,
  SubFormTemplate,
  type ValidatedState,
  type ExcludableTemplate,
} from '../../../model';
import { PromiseScheduler } from '../../../test-utils';

describe('AbstractForm', () => {
  test('Its value consists of all included, non-transient fields.', () => {
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({ name: 'firstName', defaultValue: 'Georg' }),
        new ExcludableField({ name: 'middleName', defaultValue: 'Christoph' }),
        new Field({ name: 'lastName', defaultValue: 'Bach' }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      firstName: 'Georg',
      middleName: 'Christoph',
      lastName: 'Bach',
    });
  });

  test('Its value does not include any transient fields.', () => {
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({ name: 'password', defaultValue: '' }),
        new Field({
          name: 'confirmPassword',
          defaultValue: '',
          transient: true,
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      password: '',
    });
  });

  test('Its value does not include the values of any excluded fields.', () => {
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({ name: 'primaryEmail', defaultValue: 'user@example.com' }),
        new ExcludableField({
          name: 'secondaryEmail',
          defaultValue: '',
          excludeByDefault: true,
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      primaryEmail: 'user@example.com',
    });
  });

  test('Its value includes the values of any included user-defined adapters.', () => {
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({ name: 'birthYear', defaultValue: '1990', transient: true }),
      ];
      public adapters = <const>[
        new Adapter({
          name: 'age',
          source: this.fields[0],
          adaptFn: ({ value }): number => {
            return 2024 - Number(value);
          },
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      age: 34,
    });
  });

  test('Its value does not include the values of any excluded adapters.', () => {
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({ name: 'firstName', defaultValue: '' }),
        new ExcludableField({
          name: 'middleName',
          defaultValue: '',
          transient: true,
          excludeByDefault: true,
        }),
        new Field({ name: 'lastName', defaultValue: '' }),
      ];
      public adapters = <const>[
        new ExcludableAdapter({
          name: 'middleInitial',
          source: this.fields[1],
          adaptFn: ({ value, exclude }) => {
            return {
              value: value.length > 0 ? value[0].toUpperCase() : '',
              exclude,
            };
          },
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      firstName: '',
      lastName: '',
    });
  });

  test('If any included fields are invalid, its validity is invalid.', () => {
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({
          name: 'requiredField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.validity).toBe(Validity.Invalid);
  });

  test('If any groups are invalid, its validity is invalid.', () => {
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({ name: 'password', defaultValue: 'password' }),
        new Field({ name: 'confirmPassword', defaultValue: '' }),
      ];
      public groups = <const>[
        new Group({
          name: 'passwordGroup',
          members: this.fields,
          validatorTemplates: [
            {
              predicate: ({ password, confirmPassword }): boolean => {
                return password === confirmPassword;
              },
            },
          ],
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.groups.passwordGroup.state.validity).toBe(Validity.Invalid);
    expect(instance.groups.passwordGroup.state.validitySource).toBe(
      GroupValiditySource.Validation,
    );
    expect(instance.state.validity).toBe(Validity.Invalid);
  });

  test(`If there is at least one pending field and no invalid fields or groups, 
  its validity is pending.`, () => {
    const promiseScheduler = new PromiseScheduler();
    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({
          name: 'pendingField',
          defaultValue: '',
          asyncValidators: [requiredAsync],
          delayAsyncValidatorExecution: 0,
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.validity).toBe(Validity.Pending);
  });

  test(`If there is at least one pending group and no invalid fields or groups, 
  its validity is pending.`, () => {
    const promiseScheduler = new PromiseScheduler();
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({ name: 'streetAddress', defaultValue: '1726 Locust St.' }),
        new Field({ name: 'city', defaultValue: 'Philadelphia' }),
        new Field({ name: 'state', defaultValue: 'PA' }),
        new Field({ name: 'zip', defaultValue: '19103' }),
      ];
      public groups = <const>[
        new Group({
          name: 'addressGroup',
          members: this.fields,
          asyncValidatorTemplates: [
            {
              predicate: ({
                streetAddress,
                city,
                state,
                zip,
              }): Promise<boolean> => {
                const validAddresses = new Set<string>([
                  '1726 Locust St., Philadelphia, PA 19103',
                ]);
                const address = `${streetAddress}, ${city}, ${state} ${zip}`;
                return promiseScheduler.createScheduledPromise(
                  validAddresses.has(address),
                );
              },
            },
          ],
          delayAsyncValidatorExecution: 0,
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.groups.addressGroup.state.validity).toBe(Validity.Pending);
    expect(instance.groups.addressGroup.state.validitySource).toBe(
      GroupValiditySource.Validation,
    );
    expect(instance.state.validity).toBe(Validity.Pending);
  });

  test('If all fields and groups are valid, its validity is valid.', () => {
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({
          name: 'password',
          defaultValue: 'password',
          validators: [StringValidators.required()],
        }),
        new Field({
          name: 'confirmPassword',
          defaultValue: 'password',
          validators: [StringValidators.required()],
        }),
      ];
      public groups = <const>[
        new Group({
          name: 'passwordGroup',
          members: this.fields,
          validatorTemplates: [
            {
              predicate: ({ password, confirmPassword }): boolean => {
                return password === confirmPassword;
              },
            },
          ],
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.validity).toBe(Validity.Valid);
  });

  test('When the value of one of its fields changes, its value is updated.', () => {
    class Template extends FormTemplate {
      public readonly fields = <const>[
        new Field({ name: 'firstName', defaultValue: '' }),
        new Field({ name: 'lastName', defaultValue: '' }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();

    expect(instance.state.value).toStrictEqual({
      firstName: '',
      lastName: '',
    });

    instance.fields.firstName.setValue('George');
    expect(instance.state.value).toStrictEqual({
      firstName: 'George',
      lastName: '',
    });

    instance.fields.lastName.setValue('Crumb');
    expect(instance.state.value).toStrictEqual({
      firstName: 'George',
      lastName: 'Crumb',
    });
  });

  test('When the value of one of its adapters changes, its value is updated.', () => {
    class Template extends FormTemplate {
      public readonly fields = <const>[
        new Field({
          name: 'firstName',
          defaultValue: '',
          transient: true,
          validators: [StringValidators.required()],
        }),
        new Field({
          name: 'lastName',
          defaultValue: '',
          transient: true,
          validators: [StringValidators.required()],
        }),
      ];
      public readonly groups = <const>[
        new Group({ name: 'fullName', members: this.fields }),
      ];
      public readonly adapters = <const>[
        new Adapter({
          name: 'fullName',
          source: this.groups[0],
          adaptFn: ({ value, validity }): string => {
            if (validity !== Validity.Valid) return '';
            return `${value.lastName}, ${value.firstName}`;
          },
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      fullName: '',
    });

    instance.fields.firstName.setValue('Samuel');
    expect(instance.state.value).toStrictEqual({
      fullName: '',
    });

    instance.fields.lastName.setValue('Coleridge-Taylor');
    expect(instance.state.value).toStrictEqual({
      fullName: 'Coleridge-Taylor, Samuel',
    });
  });

  test('When the validity of one of its fields changes, its validity is updated.', () => {
    class Template extends FormTemplate {
      public readonly fields = <const>[
        new Field({
          name: 'requiredField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.validity).toBe(Validity.Invalid);

    instance.fields.requiredField.setValue('test');
    expect(instance.state.validity).toBe(Validity.Valid);
  });

  test(`When the validity of one of its groups changes, its validity is 
  updated.`, () => {
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({ name: 'password', defaultValue: 'password' }),
        new Field({ name: 'confirmPassword', defaultValue: '' }),
      ];
      public groups = <const>[
        new Group({
          name: 'passwordGroup',
          members: this.fields,
          validatorTemplates: [
            {
              predicate: ({ password, confirmPassword }): boolean => {
                return password === confirmPassword;
              },
            },
          ],
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state.validity).toBe(Validity.Invalid);

    instance.fields.confirmPassword.setValue(
      instance.fields.password.state.value,
    );
    expect(instance.state.validity).toBe(Validity.Valid);
  });

  test(`When setSubmitted() is called, its state.submitted property becomes 
  true.`, () => {
    class Template extends FormTemplate {
      public readonly fields = [];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();

    instance.setSubmitted();
    expect(instance.state.submitted).toBe(true);
  });

  test(`When setSubmitted() is called, setSubmitted() is called on all of its 
  included fields that implement Submittable.`, () => {
    class SubTemplate extends SubFormTemplate {
      public readonly name = 'subForm';
      public readonly fields = <const>[
        new Field({
          name: 'subFormField1',
          defaultValue: '',
        }),
        new Field({
          name: 'subFormField2',
          defaultValue: '',
        }),
      ];
    }

    const SubForm = FormFactory.createSubForm(SubTemplate);

    class Template extends FormTemplate {
      public readonly fields = <const>[
        new Field({
          name: 'field1',
          defaultValue: '',
        }),
        new Field({
          name: 'field2',
          defaultValue: '',
        }),
        new SubForm(),
      ];
    }

    const Form = FormFactory.createForm(Template);
    const instance = new Form();
    expect(instance.state.submitted).toBe(false);

    for (const field of Object.values(instance.fields)) {
      expect(field.state.submitted).toBe(false);
    }

    for (const field of Object.values(instance.fields.subForm.fields)) {
      expect(field.state.submitted).toBe(false);
    }

    instance.setSubmitted();
    expect(instance.state.submitted).toBe(true);

    for (const field of Object.values(instance.fields)) {
      expect(field.state.submitted).toBe(true);
    }

    for (const field of Object.values(instance.fields.subForm.fields)) {
      expect(field.state.submitted).toBe(true);
    }
  });

  test(`When setSubmitted() is called, setSubmitted() is called not called on 
  excluded fields.`, () => {
    class SubTemplate extends SubFormTemplate implements ExcludableTemplate {
      public readonly name = 'excludedSubform';
      public readonly fields = <const>[
        new Field({
          name: 'subFormField1',
          defaultValue: '',
        }),
        new Field({
          name: 'subFormField2',
          defaultValue: '',
        }),
      ];
      public readonly excludeByDefault = true;
    }

    const ExcludedSubForm = FormFactory.createExcludableSubForm(SubTemplate);

    class Template extends FormTemplate {
      public readonly fields = <const>[
        new ExcludableField({
          name: 'excludedField',
          defaultValue: '',
          excludeByDefault: true,
        }),
        new ExcludableField({
          name: 'includedExcludableField',
          defaultValue: '',
          excludeByDefault: false,
        }),
        new ExcludedSubForm(),
      ];
    }

    const Form = FormFactory.createForm(Template);
    const instance = new Form();

    instance.setSubmitted();
    expect(instance.state.submitted).toBe(true);
    expect(instance.fields.excludedField.state.submitted).toBe(false);
    expect(instance.fields.includedExcludableField.state.submitted).toBe(true);

    expect(instance.fields.excludedSubform.state.submitted).toBe(false);
    for (const field of Object.values(instance.fields.excludedSubform.fields)) {
      expect(field.state.submitted).toBe(false);
    }
  });

  test('When reset() is called, submitted is set to false.', () => {
    class Template extends FormTemplate {
      public readonly fields = [];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();

    instance.setSubmitted();
    expect(instance.state.submitted).toBe(true);

    instance.reset();
    expect(instance.state.submitted).toBe(false);
  });

  test(`When reset() is called, reset is called on all of its fields that 
  implement Resettable.`, () => {
    class Template extends FormTemplate {
      public fields = <const>[
        new Field({ name: 'firstName', defaultValue: '' }),
        new Field({ name: 'middleName', defaultValue: '' }),
        new Field({ name: 'lastName', defaultValue: '' }),
        new Field({ name: 'age', defaultValue: 0 }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();

    const spies = Object.values(instance.fields).map(field => {
      return vi.spyOn(field, 'reset');
    });

    instance.fields.firstName.setValue('Johann');
    instance.fields.middleName.setValue('Sebastian');
    instance.fields.lastName.setValue('Bach');
    instance.fields.age.setValue(338);

    expect(instance.state.value).toStrictEqual({
      firstName: 'Johann',
      middleName: 'Sebastian',
      lastName: 'Bach',
      age: 338,
    });

    instance.reset();

    spies.forEach(spy => expect(spy).toHaveBeenCalledOnce());
    expect(instance.fields.firstName.state.value).toBe('');
    expect(instance.fields.middleName.state.value).toBe('');
    expect(instance.fields.lastName.state.value).toBe('');
    expect(instance.fields.age.state.value).toBe(0);
    expect(instance.state.value).toStrictEqual({
      firstName: '',
      middleName: '',
      lastName: '',
      age: 0,
    });
  });

  test(`After subscribeToState() has been called, state updates are emitted to 
  subscribers.`, () => {
    const promiseScheduler = new PromiseScheduler();
    const emailIsAvailable = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        const unavailableEmails = new Set<string>();
        return promiseScheduler.createScheduledPromise(
          !unavailableEmails.has(value),
        );
      },
    });
    class Template extends FormTemplate {
      public readonly fields = <const>[
        new Field({
          name: 'email',
          defaultValue: '',
          validators: [StringValidators.required()],
          asyncValidators: [emailIsAvailable],
          delayAsyncValidatorExecution: 0,
        }),
      ];
    }
    const TestForm = FormFactory.createForm(Template);
    const instance = new TestForm();
    expect(instance.state).toStrictEqual({
      value: {
        email: '',
      },
      validity: Validity.Invalid,
      submitted: false,
      didPropertyChange: expect.any(Function),
    });

    let counter = 0;
    instance.subscribeToState(state => {
      if (counter === 0) {
        expect(state).toStrictEqual({
          value: {
            email: 'user@example.com',
          },
          validity: Validity.Pending,
          submitted: false,
          didPropertyChange: expect.any(Function),
        });
      } else {
        expect(state).toStrictEqual({
          value: {
            email: 'user@example.com',
          },
          validity: Validity.Valid,
          submitted: false,
          didPropertyChange: expect.any(Function),
        });
      }
      counter++;
    });

    instance.fields.email.setValue('user@example.com');
    promiseScheduler.resolveAll();
  });

  test(`When its value changes, didPropertyChange() returns true when called 
  with 'value.'`, () => {
    class Template extends FormTemplate {
      public readonly fields = [
        new Field({
          name: 'field',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    const instance = new Form();

    expect(instance.state.didPropertyChange('value')).toBe(false);

    instance.fields.field.setValue('test');

    expect(instance.state.didPropertyChange('value')).toBe(true);
  });

  test(`Test when its validity changes, didPropertyChange() returns true when 
  called with 'validity.'`, () => {
    class Template extends FormTemplate {
      public readonly fields = [
        new Field({
          name: 'requiredField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    const instance = new Form();

    expect(instance.state.didPropertyChange('validity')).toBe(false);

    instance.fields.requiredField.setValue('test');

    expect(instance.state.didPropertyChange('validity')).toBe(true);
  });

  test(`When its submitted property changes, didPropertyChange() returns true 
  when called with 'submitted.'`, () => {
    class Template extends FormTemplate {
      public readonly fields = [];
    }

    const Form = FormFactory.createForm(Template);

    const instance = new Form();

    expect(instance.state.didPropertyChange('submitted')).toBe(false);

    instance.setSubmitted();

    expect(instance.state.didPropertyChange('submitted')).toBe(true);
  });

  test(`When didPropertyChange() is called with a property that does not exist 
  on its state object, it returns false.`, () => {
    class Template extends FormTemplate {
      public readonly fields = [];
    }

    const Form = FormFactory.createForm(Template);

    const instance = new Form();

    expect(
      instance.state.didPropertyChange(
        'unknown property' as keyof ValidatedState,
      ),
    ).toBe(false);
  });
});
