import { describe, test, expect, vi } from 'vitest';
import { StateManager } from '../../../model';

describe('StateManagerWithChangeLog', () => {
  test('Getting state returns an object of type StateWithChanges<T>.', () => {
    const stateManager = new StateManager({
      someValue: 'test',
    });

    expect(stateManager.state).toStrictEqual({
      someValue: 'test',
      didPropertyChange: expect.any(Function),
    });
  });

  test(`If updateProperties() has not been called, state.didPropertyChange()
  returns false for any property.`, () => {
    interface State {
      prop1: string;
      prop2: number;
      prop3: bigint;
      prop4: {
        nestedProp: string;
      };
    }

    const stateManager = new StateManager<State>({
      prop1: 'test',
      prop2: 34,
      prop3: 123456789n,
      prop4: {
        nestedProp: '',
      },
    });

    for (const key of Object.keys(stateManager.state)) {
      expect(stateManager.state.didPropertyChange(key as keyof State)).toBe(
        false,
      );
    }
  });

  test('When updateProperties() is called, state is updated.', () => {
    const stateManager = new StateManager({
      myValue: 'hello',
    });

    stateManager.updateProperties({ myValue: 'world' });

    expect(stateManager.state).toStrictEqual({
      myValue: 'world',
      didPropertyChange: expect.any(Function),
    });
  });

  test(`If updateProperties() has been called, didPropertyChange() returns true
  for any property that was updated.`, () => {
    const stateManager = new StateManager({
      prop1: 'test',
      prop2: 34,
      prop3: 123456789n,
      prop4: {
        nestedProp: '',
      },
    });

    stateManager.updateProperties({
      prop1: '',
      prop4: {
        nestedProp: 'test',
      },
    });

    expect(stateManager.state.didPropertyChange('prop1')).toBe(true);
    expect(stateManager.state.didPropertyChange('prop4')).toBe(true);
  });

  test(`If updateProperties() has been called, didPropertyChange() returns false
  for any property that was not updated.`, () => {
    const stateManager = new StateManager({
      prop1: 'test',
      prop2: 34,
      prop3: 123456789n,
      prop4: {
        nestedProp: '',
      },
    });

    stateManager.updateProperties({
      prop1: '',
      prop4: {
        nestedProp: 'test',
      },
    });

    expect(stateManager.state.didPropertyChange('prop2')).toBe(false);
    expect(stateManager.state.didPropertyChange('prop3')).toBe(false);
  });

  test('When state changes, updates are emitted to subscribers.', () => {
    const stateManager = new StateManager({
      prop1: 'test',
      prop2: 34,
      prop3: 123456789n,
      prop4: {
        nestedProp: '',
      },
    });

    const observer = vi.fn();
    stateManager.subscribeToState(observer);
    stateManager.updateProperties({ prop4: { nestedProp: 'hello' } });

    expect(observer).toHaveBeenCalledWith(
      expect.objectContaining({
        prop1: 'test',
        prop2: 34,
        prop3: 123456789n,
        prop4: {
          nestedProp: 'hello',
        },
        didPropertyChange: expect.any(Function),
      }),
    );
  });
});
