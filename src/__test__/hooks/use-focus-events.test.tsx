import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { describe, test, expect, afterEach } from 'vitest';
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFocusEvents } from '../../hooks';
import { Field } from '../../model';
import { useKeyboardNavigation } from '../../test-utils';

describe('useFocusEvents()', () => {
  afterEach(cleanup);

  test(`It calls useCancelFocusOnUnmount() and cancels focus on unmount.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
    });

    const inputId = 'input';

    function Input(): React.JSX.Element {
      return <input data-testid={inputId} {...useFocusEvents(field)} />;
    }

    const linkText = 'Go to form';

    function TestApp(): React.JSX.Element {
      useKeyboardNavigation();

      return (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              Component={() => <Link to="/form">{linkText}</Link>}
            />
            <Route path="/form" Component={Input} />
          </Routes>
        </BrowserRouter>
      );
    }

    const user = userEvent.setup();
    render(<TestApp />);

    const link = screen.getByText(linkText);
    await user.click(link);
    await waitFor(() => expect(screen.queryByTestId(inputId)).toBeTruthy());

    const input = screen.getByTestId(inputId);
    await user.click(input);
    await waitFor(() => expect(field.state.isInFocus).toBe(true));

    fireEvent(
      document,
      new KeyboardEvent('keyup', {
        altKey: true,
        key: 'ArrowLeft',
      }),
    );

    await waitFor(() => expect(screen.queryByTestId(inputId)).toBeNull());
    expect(field.state.isInFocus).toBe(false);
  });

  test(`When it is called and its result is spread into the props of an element, 
  the field it received as an argument becomes focused when that element is 
  focused and is blurred when that element is blurred.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
    });

    const user = userEvent.setup();
    const inputId = 'input';

    function Input(): React.JSX.Element {
      return <input {...useFocusEvents(field)} data-testid={inputId} />;
    }

    render(<Input />);

    const input = screen.getByTestId(inputId);
    await user.click(input);
    expect(field.state.isInFocus).toBe(true);
    expect(field.state.hasBeenBlurred).toBe(false);

    input.blur();
    expect(field.state.isInFocus).toBe(false);
    expect(field.state.hasBeenBlurred).toBe(true);
  });
});
