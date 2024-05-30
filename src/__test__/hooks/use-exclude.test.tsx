import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useExclude } from '../../hooks';
import { ExcludableField } from '../../model';

describe('useExclude()', () => {
  afterEach(cleanup);

  test(`It returns a React state variable of type boolean whose value is 
  updated when the state.exclude property of the entity it received is 
  toggled.`, async () => {
    const field = new ExcludableField({
      name: 'testField',
      defaultValue: '',
    });

    function TestComponent(): React.JSX.Element {
      const exclude = useExclude(field);

      return (
        <input
          type="checkbox"
          checked={exclude}
          onChange={e => {
            field.setExclude(e.target.checked);
          }}
          data-testid="checkbox"
        />
      );
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const input = screen.getByTestId('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(false);

    await user.click(input);
    await waitFor(() => expect(input.checked).toBe(true));
  });
});
