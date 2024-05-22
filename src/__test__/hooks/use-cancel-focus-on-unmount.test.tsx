import React from 'react';
import { Link, BrowserRouter, Route, Routes } from 'react-router-dom';
import { describe, test, afterEach, expect } from 'vitest';
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from '../../model';
import { useFocusEvents } from '../../hooks';
import { useKeyboardNavigation } from '../../test-utils';

describe('useCancelFocusOnUnmount()', () => {
  afterEach(cleanup);

  // Sanity check
  test(`If omitted, if a focused element unmounts without its blur() method 
  having been called, the cancelFocus() method of the corresponding field is 
  not called.`, async () => {
    const field = new Field({
      name: 'test',
      defaultValue: '',
    });

    const linkText = 'Go to form';

    function Home(): React.JSX.Element {
      return <Link to="/form">{linkText}</Link>;
    }

    const inputId = 'input';

    function Input(): React.JSX.Element {
      return (
        <input
          data-testid={inputId}
          onFocus={() => field.focus()}
          onBlur={() => field.blur()}
        />
      );
    }

    function TestApp(): React.JSX.Element {
      useKeyboardNavigation();

      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/form" Component={Input} />
          </Routes>
        </BrowserRouter>
      );
    }

    const user = userEvent.setup();
    render(<TestApp />);

    const input = screen.queryByTestId(inputId);
    expect(input).toBeFalsy();

    const linkToForm = screen.getByText(linkText);
    await user.click(linkToForm);

    await waitFor(() => expect(screen.queryByTestId(inputId)).toBeTruthy());
    expect(screen.queryByText(linkText)).toBeFalsy();

    await user.click(screen.getByTestId(inputId));
    expect(field.state.isInFocus).toBe(true);

    fireEvent(
      document,
      new KeyboardEvent('keyup', {
        altKey: true,
        key: 'ArrowLeft',
      }),
    );
    await waitFor(() => expect(screen.queryByText(linkText)).toBeTruthy());
    expect(screen.queryByTestId(inputId)).toBeFalsy();
    expect(field.state.isInFocus).toBe(true);
    expect(field.state.hasBeenBlurred).toBe(false);
  });

  test(`It calls cancelFocus() on the entity it receives when the component in 
  which it was called unmounts.`, async () => {
    const field = new Field({
      name: 'test',
      defaultValue: '',
    });

    const linkText = 'Go to form';

    function Home(): React.JSX.Element {
      return <Link to="/form">{linkText}</Link>;
    }

    const inputId = 'input';

    function Input(): React.JSX.Element {
      return (
        <input
          {...useFocusEvents(field)}
          data-testid={inputId}
          onFocus={() => field.focus()}
          onBlur={() => field.blur()}
        />
      );
    }

    function TestApp(): React.JSX.Element {
      useKeyboardNavigation();

      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/form" Component={Input} />
          </Routes>
        </BrowserRouter>
      );
    }

    const user = userEvent.setup();
    render(<TestApp />);

    const input = screen.queryByTestId(inputId);
    expect(input).toBeFalsy();

    const linkToForm = screen.getByText(linkText);
    await user.click(linkToForm);

    await waitFor(() => expect(screen.queryByTestId(inputId)).toBeTruthy());
    expect(screen.queryByText(linkText)).toBeFalsy();

    await user.click(screen.getByTestId(inputId));
    expect(field.state.isInFocus).toBe(true);

    fireEvent(
      document,
      new KeyboardEvent('keyup', {
        altKey: true,
        key: 'ArrowLeft',
      }),
    );
    await waitFor(() => expect(screen.queryByText(linkText)).toBeTruthy());
    expect(screen.queryByTestId(inputId)).toBeFalsy();
    expect(field.state.isInFocus).toBe(false);
    expect(field.state.hasBeenBlurred).toBe(false);
  });
});
