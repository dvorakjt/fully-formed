import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSubscription } from '../../hooks';
import { StateManager } from '../../model';

describe('useSubscription()', () => {
  afterEach(cleanup);

  test(`It returns a React state variable that updates when the state of the 
  entity it received changes.`, async () => {
    const entity = new StateManager(0);

    const counterId = 'counter';

    function TestComponent(): React.JSX.Element {
      const state = useSubscription(entity);

      return (
        <>
          <div data-testid={counterId}>{state}</div>
          <button
            onClick={() => {
              entity.state = entity.state + 1;
            }}
          >
            Increment
          </button>
        </>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    const counter = screen.getByTestId(counterId);
    expect(counter.textContent).toBe('0');

    const increment = screen.getByText('Increment');
    await user.click(increment);
    await waitFor(() => expect(counter.textContent).toBe('1'));
  });
});
