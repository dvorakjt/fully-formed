import { describe, test, expect } from 'vitest';
import {
  MultiAdapter,
  Field,
  StringValidators,
  AsyncValidator,
  Validity,
} from '../../../model';
import { PromiseScheduler } from '../../../test-utils';

describe('MultiAdapter', () => {
  test(`It calls its adaptFn with with states of its sources to get its initial 
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
    ] as const;

    const adapter = new MultiAdapter({
      name: 'sum',
      sources,
      adaptFn: ([{ value: num1 }, { value: num2 }]): number => {
        return num1 + num2;
      },
    });

    expect(adapter.state.value).toBe(7);
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

    const adapter = new MultiAdapter({
      name: 'concatThree',
      sources,
      adaptFn: ([
        { value: str1 },
        { value: str2 },
        { value: str3 },
      ]): string => {
        return `${str1}, ${str2}, ${str3}`;
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

    const adapter = new MultiAdapter({
      name: 'concatTwo',
      sources,
      adaptFn: ([{ value: str1 }, { value: str2 }]): string => {
        return `${str1}, ${str2}`;
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

    const adapter = new MultiAdapter({
      name: 'toUpper',
      sources,
      adaptFn: ([{ value }]): string => {
        return value.toUpperCase();
      },
    });

    expect(adapter.state.validity).toBe(Validity.Valid);
  });

  test('If sources is an empty array, it is valid.', () => {
    const adapter = new MultiAdapter({
      name: 'adapterWithNoSources',
      sources: [],
      adaptFn: (): string => 'test',
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

    const adapter = new MultiAdapter({
      name: 'sum',
      sources,
      adaptFn: ([{ value: num1 }, { value: num2 }]): number => {
        return num1 + num2;
      },
    });

    expect(adapter.state.value).toBe(7);

    sources[0].setValue(-4);
    expect(adapter.state.value).toBe(0);

    sources[1].setValue(9);
    expect(adapter.state.value).toBe(5);
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

    const adapter = new MultiAdapter({
      name: 'concatThree',
      sources,
      adaptFn: ([
        { value: str1 },
        { value: str2 },
        { value: str3 },
      ]): string => {
        return `${str1}, ${str2}, ${str3}`;
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
