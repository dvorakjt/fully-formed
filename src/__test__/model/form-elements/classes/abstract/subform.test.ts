import { describe, test, expect, vi } from 'vitest';
import {
  ExcludableField,
  Field,
  FormFactory,
  Adapter,
  ExcludableAdapter,
  StringValidators,
  Validity,
  Group,
  GroupValiditySource,
  AsyncValidator,
  type ExcludableAdaptFnReturnType,
} from '../../../../../model';
import { PromiseScheduler } from '../../../../../test-utils';
import { FormTemplate } from '../../../../../model';

describe('Form', () => {
  test('Its id defaults to its name.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = [];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.name).toBe('TestForm');
    expect(instance.id).toBe(instance.name);
  });

  test('Its value consists of all included, non-transient fields.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({ name: 'firstName', defaultValue: 'Georg' }),
        new ExcludableField({ name: 'middleName', defaultValue: 'Christoph' }),
        new Field({ name: 'lastName', defaultValue: 'Bach' }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      firstName: 'Georg',
      middleName: 'Christoph',
      lastName: 'Bach',
    });
  });

  test('Its value does not include any transient fields.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({ name: 'password', defaultValue: '' }),
        new Field({
          name: 'confirmPassword',
          defaultValue: '',
          transient: true,
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      password: '',
    });
  });

  test('Its value does not include the values of any excluded excludable fields.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({ name: 'primaryEmail', defaultValue: 'user@example.com' }),
        new ExcludableField({
          name: 'secondaryEmail',
          defaultValue: '',
          excludeByDefault: true,
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      primaryEmail: 'user@example.com',
    });
  });

  test('Its value includes the values of any included user-defined adapters.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({ name: 'birthYear', defaultValue: '1990', transient: true }),
      ];
      public adapters = <const>[
        new Adapter({
          name: 'age',
          source: this.formElements[0],
          adaptFn: ({ value }): number => {
            return 2024 - Number(value);
          },
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      age: 34,
    });
  });

  test('Its value does not include the values of any excluded excludable adapters.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
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
          source: this.formElements[1],
          adaptFn: ({
            value,
            exclude,
          }): ExcludableAdaptFnReturnType<string> => {
            return {
              value: value.length > 0 ? value[0].toUpperCase() : '',
              exclude,
            };
          },
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      firstName: '',
      lastName: '',
    });
  });

  test('If any included fields are invalid, its validity is invalid.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({
          name: 'requiredField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.validity).toBe(Validity.Invalid);
  });

  test('If any groups are invalid, its validity is invalid.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({ name: 'password', defaultValue: 'password' }),
        new Field({ name: 'confirmPassword', defaultValue: '' }),
      ];
      public groups = <const>[
        new Group({
          name: 'passwordGroup',
          members: this.formElements,
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
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.groups.passwordGroup.state.validity).toBe(Validity.Invalid);
    expect(instance.groups.passwordGroup.state.validitySource).toBe(
      GroupValiditySource.Validation,
    );
    expect(instance.state.validity).toBe(Validity.Invalid);
  });

  test('If there is at least one pending field and no invalid fields or groups, its validity is pending.', () => {
    const promiseScheduler = new PromiseScheduler();
    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({
          name: 'pendingField',
          defaultValue: '',
          asyncValidators: [requiredAsync],
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.validity).toBe(Validity.Pending);
  });

  test('If there is at least one pending group and no invalid fields or groups, its validity is pending.', () => {
    const promiseScheduler = new PromiseScheduler();
    class Template extends FormTemplate {
      public readonly name = 'AddressForm';
      public formElements = <const>[
        new Field({ name: 'streetAddress', defaultValue: '1726 Locust St.' }),
        new Field({ name: 'city', defaultValue: 'Philadelphia' }),
        new Field({ name: 'state', defaultValue: 'PA' }),
        new Field({ name: 'zip', defaultValue: '19103' }),
      ];
      public groups = <const>[
        new Group({
          name: 'addressGroup',
          members: this.formElements,
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
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.groups.addressGroup.state.validity).toBe(Validity.Pending);
    expect(instance.groups.addressGroup.state.validitySource).toBe(
      GroupValiditySource.Validation,
    );
    expect(instance.state.validity).toBe(Validity.Pending);
  });

  test('If all fields and groups are valid, its validity is valid.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
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
          members: this.formElements,
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
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.validity).toBe(Validity.Valid);
  });

  test('If its validity is invalid and it has an invalid message, that message is included the messages array of its state.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({
          name: 'requiredField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ];
      public invalidMessage = 'The form has invalid fields.';
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.messages).toStrictEqual([
      {
        text: 'The form has invalid fields.',
        validity: Validity.Invalid,
      },
    ]);
  });

  test('If its validity is pending and it has a pending message, that message is included in the messages array of its state.', () => {
    const promiseScheduler = new PromiseScheduler();
    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({
          name: 'pendingField',
          defaultValue: '',
          asyncValidators: [requiredAsync],
        }),
      ];
      public pendingMessage = 'Checking fields...';
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.messages).toStrictEqual([
      {
        text: 'Checking fields...',
        validity: Validity.Pending,
      },
    ]);
  });

  test('If its validity is valid and it has a valid message, that message is included in the messages array of its state.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
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
          members: this.formElements,
          validatorTemplates: [
            {
              predicate: ({ password, confirmPassword }): boolean => {
                return password === confirmPassword;
              },
            },
          ],
        }),
      ];
      public validMessage = 'All fields are valid!';
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.messages).toStrictEqual([
      {
        text: 'All fields are valid!',
        validity: Validity.Valid,
      },
    ]);
  });

  test('When the value of one of its form elements changes, its value is updated.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = <const>[
        new Field({ name: 'firstName', defaultValue: '' }),
        new Field({ name: 'lastName', defaultValue: '' }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();

    expect(instance.state.value).toStrictEqual({
      firstName: '',
      lastName: '',
    });

    instance.formElements.firstName.setValue('George');
    expect(instance.state.value).toStrictEqual({
      firstName: 'George',
      lastName: '',
    });

    instance.formElements.lastName.setValue('Crumb');
    expect(instance.state.value).toStrictEqual({
      firstName: 'George',
      lastName: 'Crumb',
    });
  });

  test('When the value of one of its adapters changes, its value is updated.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = <const>[
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
        new Group({ name: 'fullName', members: this.formElements }),
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
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.value).toStrictEqual({
      fullName: '',
    });

    instance.formElements.firstName.setValue('Samuel');
    expect(instance.state.value).toStrictEqual({
      fullName: '',
    });

    instance.formElements.lastName.setValue('Coleridge-Taylor');
    expect(instance.state.value).toStrictEqual({
      fullName: 'Coleridge-Taylor, Samuel',
    });
  });

  test('When the validity of one of its form elements changes, its validity is updated.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = <const>[
        new Field({
          name: 'requiredField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.validity).toBe(Validity.Invalid);

    instance.formElements.requiredField.setValue('test');
    expect(instance.state.validity).toBe(Validity.Valid);
  });

  test('When the validity of one of its groups changes, its validity is updated.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({ name: 'password', defaultValue: 'password' }),
        new Field({ name: 'confirmPassword', defaultValue: '' }),
      ];
      public groups = <const>[
        new Group({
          name: 'passwordGroup',
          members: this.formElements,
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
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state.validity).toBe(Validity.Invalid);

    instance.formElements.confirmPassword.setValue(
      instance.formElements.password.state.value,
    );
    expect(instance.state.validity).toBe(Validity.Valid);
  });

  test('When confirm() is called, confirmationAttempted is set to true.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = [];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.confirmationAttempted).toBe(false);

    instance.confirm();
    expect(instance.confirmationAttempted).toBe(true);
  });

  test("When confirm() is called with an onSuccess callback and the form is valid, that callback is called with the form's value.", () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({
          name: 'firstName',
          defaultValue: 'Sergei',
          transient: true,
        }),
        new Field({
          name: 'lastName',
          defaultValue: 'Rachmaninoff',
          transient: true,
        }),
      ];
      public groups = <const>[
        new Group({ name: 'fullName', members: this.formElements }),
      ];
      public adapters = <const>[
        new Adapter({
          name: 'fullName',
          source: this.groups[0],
          adaptFn: ({ value }): string => {
            return `${value.lastName}, ${value.firstName}`;
          },
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    const onSuccess = vi.fn();

    instance.confirm({
      onSuccess,
    });

    expect(onSuccess).toHaveBeenCalledWith({
      fullName: 'Rachmaninoff, Sergei',
    });
  });

  test('When confirm() is called with an onFailure callback and the form is invalid, that callback is called.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({
          name: 'requiredField',
          defaultValue: '',
          validators: [StringValidators.required()],
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    const onFailure = vi.fn();

    instance.confirm({ onFailure });

    expect(onFailure).toHaveBeenCalledOnce();
  });

  test('When confirm() is called with an onFailure callback and the form is pending, that callback is called.', () => {
    const promiseScheduler = new PromiseScheduler();
    const requiredAsync = new AsyncValidator<string>({
      predicate: (value): Promise<boolean> => {
        return promiseScheduler.createScheduledPromise(value.length > 0);
      },
    });
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({
          name: 'pendingField',
          defaultValue: '',
          asyncValidators: [requiredAsync],
        }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    const onFailure = vi.fn();

    instance.confirm({ onFailure });

    expect(onFailure).toHaveBeenCalledOnce();
  });

  test('When confirm() is called, all of its subforms are confirmed as well.', () => {
    class InnerFormTemplate extends FormTemplate {
      public readonly name = 'subForm';
      public readonly formElements = [];
    }

    const InnerForm = FormFactory.createSubForm(InnerFormTemplate);
    class OuterFormTemplate extends FormTemplate {
      public readonly name = 'outerForm';
      public readonly formElements = <const>[new InnerForm()];
    }
    const OuterForm = FormFactory.createSubForm(OuterFormTemplate);
    const instance = new OuterForm();
    const spy = vi.spyOn(instance.formElements.subForm, 'confirm');
    instance.confirm();
    expect(spy).toHaveBeenCalledOnce();
  });

  test('When reset() is called, confirmationAttempted is set to false.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = [];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();

    instance.confirm();
    expect(instance.confirmationAttempted).toBe(true);

    instance.reset();
    expect(instance.confirmationAttempted).toBe(false);
  });

  test('When reset() is called, reset is called on all of its form elements.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public formElements = <const>[
        new Field({ name: 'firstName', defaultValue: '' }),
        new Field({ name: 'middleName', defaultValue: '' }),
        new Field({ name: 'lastName', defaultValue: '' }),
        new Field({ name: 'age', defaultValue: 0 }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();

    const spies = Object.values(instance.formElements).map(formElement => {
      return vi.spyOn(formElement, 'reset');
    });

    instance.formElements.firstName.setValue('Johann');
    instance.formElements.middleName.setValue('Sebastian');
    instance.formElements.lastName.setValue('Bach');
    instance.formElements.age.setValue(338);

    expect(instance.state.value).toStrictEqual({
      firstName: 'Johann',
      middleName: 'Sebastian',
      lastName: 'Bach',
      age: 338,
    });

    instance.reset();

    spies.forEach(spy => expect(spy).toHaveBeenCalledOnce());
    expect(instance.formElements.firstName.state.value).toBe('');
    expect(instance.formElements.middleName.state.value).toBe('');
    expect(instance.formElements.lastName.state.value).toBe('');
    expect(instance.formElements.age.state.value).toBe(0);
    expect(instance.state.value).toStrictEqual({
      firstName: '',
      middleName: '',
      lastName: '',
      age: 0,
    });
  });

  test('After subscribeToState() has been called, state updates are emitted to subscribers.', () => {
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
      public readonly name = 'TestForm';
      public readonly formElements = <const>[
        new Field({
          name: 'email',
          defaultValue: '',
          validators: [StringValidators.required()],
          asyncValidators: [emailIsAvailable],
        }),
      ];
      public validMessage = 'All fields are valid!';
      public pendingMessage = 'Checking fields...';
      public invalidMessage = 'The form has invalid fields.';
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    expect(instance.state).toStrictEqual({
      value: {
        email: '',
      },
      validity: Validity.Invalid,
      messages: [
        {
          text: 'The form has invalid fields.',
          validity: Validity.Invalid,
        },
      ],
    });

    let counter = 0;
    instance.subscribeToState(state => {
      if (counter === 0) {
        expect(state).toStrictEqual({
          value: {
            email: 'user@example.com',
          },
          validity: Validity.Pending,
          messages: [
            {
              text: 'Checking fields...',
              validity: Validity.Pending,
            },
          ],
        });
      } else {
        expect(state).toStrictEqual({
          value: {
            email: 'user@example.com',
          },
          validity: Validity.Valid,
          messages: [
            {
              text: 'All fields are valid!',
              validity: Validity.Valid,
            },
          ],
        });
      }
      counter++;
    });

    instance.formElements.email.setValue('user@example.com');
    promiseScheduler.resolveAll();
  });

  test('After subscribeToConfirmationAttempted() has been called, updates to confirmationAttempted are emitted to subscribers.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = [];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    const subscribe = vi.fn();
    instance.subscribeToConfirmationAttempted(subscribe);

    instance.confirm();
    instance.reset();

    expect(subscribe).toHaveBeenNthCalledWith(1, true);
    expect(subscribe).toHaveBeenNthCalledWith(2, false);
  });

  //messages
  test("When setMessages(), the messages property of the form's state is set.", () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = [];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    instance.setMessages([
      {
        text: 'Custom message',
        validity: Validity.Valid,
      },
      {
        text: 'Another custom message',
        validity: Validity.Valid,
      },
    ]);
    expect(instance.state.messages).toStrictEqual([
      {
        text: 'Custom message',
        validity: Validity.Valid,
      },
      {
        text: 'Another custom message',
        validity: Validity.Valid,
      },
    ]);
  });

  test('When the state of the form changes, any messages added with setMessage() are removed.', () => {
    class Template extends FormTemplate {
      public readonly name = 'TestForm';
      public readonly formElements = <const>[
        new Field({ name: 'myField', defaultValue: '' }),
      ];
    }
    const TestForm = FormFactory.createSubForm(Template);
    const instance = new TestForm();
    instance.setMessages([
      {
        text: 'Custom message',
        validity: Validity.Valid,
      },
      {
        text: 'Another custom message',
        validity: Validity.Valid,
      },
    ]);
    expect(instance.state.messages).toStrictEqual([
      {
        text: 'Custom message',
        validity: Validity.Valid,
      },
      {
        text: 'Another custom message',
        validity: Validity.Valid,
      },
    ]);

    instance.formElements.myField.setValue('test');
    expect(instance.state.messages).toStrictEqual([]);
  });
});
