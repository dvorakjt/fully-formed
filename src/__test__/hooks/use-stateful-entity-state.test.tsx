import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { StateManager } from '../../model';
import { useStatefulEntityState } from '../../hooks';

describe('useStatefulEntityState()', () => {
  afterEach(cleanup);

  test(`It returns the state of an instance of a class that implements the 
  Stateful interface. This value is updated when the state of the instance 
  changes.`, async () => {
    const stateManager = new StateManager<number>(0);

    function TestComponent(): React.ReactNode {
      const count = useStatefulEntityState(stateManager);

      return <p data-testid="count">{count}</p>;
    }

    render(<TestComponent />);
    const count = screen.queryByTestId('count');
    expect(count?.textContent).toBe('0');

    stateManager.state = stateManager.state + 1;
    await waitFor(() => expect(count?.textContent).toBe('1'));
  });
});
