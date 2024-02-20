import { describe, test, expect } from 'vitest';
import { StateManager } from '../../../../../model';

describe('StateManager', () => {
  test('Getting state returns the default state.', () => {
    const defaultState = '';
    const stateManager = new StateManager<string>(defaultState);
    expect(stateManager.state).toBe(defaultState);
  });

  test('Getting state returns the set state.', () => {
    const stateManager = new StateManager<string>('');
    const updatedState = 'test';
    stateManager.state = updatedState;
    expect(stateManager.state).toBe(updatedState);
  });

  test('Setting state emits that value to subscribers.', () => {
    const stateManager = new StateManager<string>('');
    const updatedState = 'test';
    stateManager.subscribeToState(state => {
      expect(state).toBe(updatedState);
    });
    stateManager.state = updatedState;
  });
});
