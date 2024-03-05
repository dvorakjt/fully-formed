import { describe, test, expect } from 'vitest';
import {
  DefaultAdapter,
  Field,
  FormValidityReducer,
  StringValidators,
  Validator,
  Validity,
  type StateWithMessages,
  Group,
} from '../../../../../model';

describe('FormValidityReducer', () => {
  test('Its validity defaults to valid.', () => {
    const reducer = new FormValidityReducer();
    expect(reducer.validity).toBe(Validity.Valid);
  });

  test('Its validity is invalid if any included adapters are invalid.', () => {
    const name = new Field({
      name: 'name',
      defaultValue: '',
      validators: [StringValidators.required()],
    });
    const nameAdapter = new DefaultAdapter({ source: name });
    const reducer = new FormValidityReducer();
    reducer.processAdapterState(nameAdapter.name, nameAdapter.state);
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('Its validity is invalid if any included transient form elements are invalid.', () => {
    const password = new Field({ name: 'password', defaultValue: 'password' });
    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: '',
      controlledBy: {
        controllers: [password],
        controlFn: ([passwordState], ownState): StateWithMessages<string> => {
          return {
            value: ownState.value,
            validity:
              ownState.value === passwordState.value ?
                Validity.Valid
              : Validity.Invalid,
            messages:
              ownState.value === passwordState.value ?
                []
              : [
                  {
                    text: 'Confirmed password must match password.',
                    validity: Validity.Invalid,
                  },
                ],
          };
        },
      },
      validators: [
        new Validator<string>({
          predicate: (value): boolean => value === password.state.value,
          invalidMessage: 'Confirmed password must match password.',
        }),
      ],
      transient : true
    });
    const reducer = new FormValidityReducer();
    reducer.processTransientElementState(confirmPassword.name, confirmPassword.state);
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('Its validity is invalid if any groups are invalid.', () => {
    const email = new Field({ name : 'email', defaultValue : 'user@example.com', validators : [StringValidators.required()]});
    const secondaryEmail = new Field({ name : 'secondaryEmail', defaultValue : 'user@example.com' });
    const contactInfo = new Group({ 
      name : 'contactInfo', 
      members : [email, secondaryEmail],
      validatorTemplates : [
        {
          predicate : ({email, secondaryEmail}):boolean => {
            return email !== secondaryEmail;
          }
        }
      ]
    });
    const reducer = new FormValidityReducer();
    reducer.processGroupState(contactInfo.name, contactInfo.state);
    expect(reducer.validity).toBe(Validity.Invalid);
  });

  test('Its validity is pending if all included adapters, included transient fields, and groups are either valid or pending.', () => {
    const reducer = new FormValidityReducer();
    reducer.processAdapterState('validAdapter', { validity : Validity.Valid });
    reducer.processTransientElementState('validTransientElement', { validity : Validity.Valid });
    reducer.processGroupState('validGroup', { validity : Validity.Valid });
    reducer.processAdapterState('pendingAdapter', { validity : Validity.Pending });
    expect(reducer.validity).toBe(Validity.Pending);
  });

  test('Its validity is valid if all included adapters, included transient fields, and groups are valid.', () => {
    const reducer = new FormValidityReducer();
    reducer.processAdapterState('validAdapter', { validity : Validity.Valid });
    reducer.processTransientElementState('validTransientElement', { validity : Validity.Valid });
    reducer.processGroupState('validGroup', { validity : Validity.Valid });
    expect(reducer.validity).toBe(Validity.Valid);
  });
});
