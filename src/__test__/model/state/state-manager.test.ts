import { describe, test, expect } from 'vitest';
import { StateManager } from '../../../model';

describe('StateManager', () => {
  test(`If state has not been updated, getting state returns the default 
  state.`, () => {
    const defaultState = '';
    const stateManager = new StateManager<string>(defaultState);
    expect(stateManager.state).toBe(defaultState);
  });

  test(`If state has been updated, getting state returns the new 
  value.`, () => {
    const stateManager = new StateManager<string>('');
    const updatedState = 'test';
    stateManager.state = updatedState;
    expect(stateManager.state).toBe(updatedState);
  });

  test('Setting state causes that value be emitted to subscribers.', () => {
    const stateManager = new StateManager<string>('');
    const updatedState = 'test';
    stateManager.subscribeToState(state => {
      expect(state).toBe(updatedState);
    });
    stateManager.state = updatedState;
  });
});
