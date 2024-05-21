import { describe, test, expect } from 'vitest';
import {
  AsyncValidator,
  ExcludableField,
  ExcludableMultiAdapter,
  Field,
  StringValidators,
  Validity,
  type ExcludableAdaptFnReturnType,
} from '../../../model';
import { PromiseScheduler } from '../../../test-utils';

describe('ExcludableMultiAdapter', () => {
  test(`It calls its adaptFn with the states of its sources to get its initial 
  value.`, () => {
    const sources = [
      new Field({
        name: 'num1',
        defaultValue: 3,
      }),
      new Field({
        name: 'num2',
        defaultValue: 4,
      }),
    ];

    const adapter = new ExcludableMultiAdapter({
      name: 'sum',
      sources,
      adaptFn: ([
        { value: num1 },
        { value: num2 },
      ]): ExcludableAdaptFnReturnType<number> => {
        return {
          value: num1 + num2,
          exclude: false,
        };
      },
    });

    expect(adapter.state.value).toBe(7);
  });

  test(`It calls its adaptFn with the states of its sources to get its exclude 
  property.`, () => {
    const sources = [
      new ExcludableField({
        name: 'excludableField',
        defaultValue: '',
        excludeByDefault: true,
      }),
    ];

    const adapter = new ExcludableMultiAdapter({
      name: 'excludableAdapter',
      sources,
      adaptFn: ([{ value, exclude }]): ExcludableAdaptFnReturnType<string> => {
        return {
          value,
          exclude,
        };
      },
    });

    expect(adapter.state.exclude).toBe(true);
  });

  test('If any of its sources are invalid, it is invalid.', () => {
    const promiseScheduler = new PromiseScheduler();

    const sources = [
      new Field({
        name: 'invalidField',
        defaultValue: '',
        validators: [StringValidators.required()],
      }),
      new Field({
        name: 'pendingField',
        defaultValue: '',
        asyncValidators: [
          new AsyncValidator<string>({
            predicate: (value): Promise<boolean> => {
              return promiseScheduler.createScheduledPromise(value.length > 0);
            },
          }),
        ],
      }),
      new Field({
        name: 'validField',
        defaultValue: '',
      }),
    ] as const;

    const adapter = new ExcludableMultiAdapter({
      name: 'concatThree',
      sources,
      adaptFn: ([
        { value: str1 },
        { value: str2 },
        { value: str3 },
      ]): ExcludableAdaptFnReturnType<string> => {
        return {
          value: `${str1}, ${str2}, ${str3}`,
          exclude: false,
        };
      },
    });

    expect(adapter.state.validity).toBe(Validity.Invalid);
  });

  test('If any of its sources are pending and none are invalid, it is pending.', () => {
    const promiseScheduler = new PromiseScheduler();

    const sources = [
      new Field({
        name: 'pendingField',
        defaultValue: '',
        asyncValidators: [
          new AsyncValidator<string>({
            predicate: (value): Promise<boolean> => {
              return promiseScheduler.createScheduledPromise(value.length > 0);
            },
          }),
        ],
      }),
      new Field({
        name: 'validField',
        defaultValue: '',
      }),
    ] as const;

    const adapter = new ExcludableMultiAdapter({
      name: 'concatTwo',
      sources,
      adaptFn: ([
        { value: str1 },
        { value: str2 },
      ]): ExcludableAdaptFnReturnType<string> => {
        return {
          value: `${str1}, ${str2}`,
          exclude: false,
        };
      },
    });

    expect(adapter.state.validity).toBe(Validity.Pending);
  });

  test('If all of its sources are valid, it is valid.', () => {
    const sources = [
      new Field({
        name: 'validField',
        defaultValue: '',
      }),
    ] as const;

    const adapter = new ExcludableMultiAdapter({
      name: 'toUpper',
      sources,
      adaptFn: ([{ value }]): ExcludableAdaptFnReturnType<string> => {
        return {
          value: value.toUpperCase(),
          exclude: false,
        };
      },
    });

    expect(adapter.state.validity).toBe(Validity.Valid);
  });

  test('If sources is an empty array, it is valid.', () => {
    const adapter = new ExcludableMultiAdapter({
      name: 'adapterWithNoSources',
      sources: [],
      adaptFn: (): ExcludableAdaptFnReturnType<string> => ({
        value: 'test',
        exclude: false,
      }),
    });

    expect(adapter.state.validity).toBe(Validity.Valid);
  });

  test('When the state of any of its sources changes, it emits a new value.', () => {
    const sources = [
      new Field({
        name: 'num1',
        defaultValue: 3,
      }),
      new Field({
        name: 'num2',
        defaultValue: 4,
      }),
    ] as const;

    const adapter = new ExcludableMultiAdapter({
      name: 'sum',
      sources,
      adaptFn: ([
        { value: num1 },
        { value: num2 },
      ]): ExcludableAdaptFnReturnType<number> => {
        return {
          value: num1 + num2,
          exclude: false,
        };
      },
    });

    expect(adapter.state.value).toBe(7);

    sources[0].setValue(-4);
    expect(adapter.state.value).toBe(0);

    sources[1].setValue(9);
    expect(adapter.state.value).toBe(5);
  });

  test(`When the state of any of its sources changes, its state.exclude property 
  is updated.`, () => {
    const sources = [
      new ExcludableField({
        name: 'excludableField',
        defaultValue: '',
        excludeByDefault: true,
      }),
    ];

    const adapter = new ExcludableMultiAdapter({
      name: 'excludableAdapter',
      sources,
      adaptFn: ([{ value, exclude }]): ExcludableAdaptFnReturnType<string> => {
        return {
          value,
          exclude,
        };
      },
    });

    expect(adapter.state.exclude).toBe(true);

    sources[0].setExclude(false);
    expect(adapter.state.exclude).toBe(false);
  });

  test(`When the validity of any of its sources changes, its own validity is 
  updated.`, () => {
    const promiseScheduler = new PromiseScheduler();

    const sources = [
      new Field({
        name: 'field1',
        defaultValue: '',
        validators: [StringValidators.required()],
      }),
      new Field({
        name: 'field2',
        defaultValue: 'test',
        asyncValidators: [
          new AsyncValidator<string>({
            predicate: (value): Promise<boolean> => {
              return promiseScheduler.createScheduledPromise(value.length > 0);
            },
          }),
        ],
      }),
      new Field({
        name: 'field3',
        defaultValue: 'test',
        validators: [StringValidators.required()],
      }),
    ] as const;

    const adapter = new ExcludableMultiAdapter({
      name: 'concatThree',
      sources,
      adaptFn: ([
        { value: str1 },
        { value: str2 },
        { value: str3 },
      ]): ExcludableAdaptFnReturnType<string> => {
        return {
          value: `${str1}, ${str2}, ${str3}`,
          exclude: false,
        };
      },
    });

    expect(adapter.state.validity).toBe(Validity.Invalid);

    sources[0].setValue('test');
    expect(adapter.state.validity).toBe(Validity.Pending);

    const subscription = adapter.subscribeToState(state => {
      expect(state.validity).toBe(Validity.Valid);

      sources[2].setValue('');
      expect(adapter.state.validity).toBe(Validity.Invalid);

      subscription.unsubscribe();
    });

    promiseScheduler.resolveAll();
  });
});
