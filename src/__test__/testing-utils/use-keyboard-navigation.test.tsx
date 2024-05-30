import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useKeyboardNavigation } from '../../test-utils';

describe('useKeyboardNavigation()', () => {
  afterEach(cleanup);

  test(`It navigates back with the user presses alt+ArrowLeft and forward when 
  the user presses alt+ArrowRight.`, async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const link = screen.getByText('Visit Another Page');
    await user.click(link);

    expect(window.location.pathname).toBe('/other');

    fireEvent(
      document,
      new KeyboardEvent('keyup', {
        altKey: true,
        key: 'ArrowLeft',
      }),
    );

    await waitFor(() => expect(window.location.pathname).toBe('/'));

    fireEvent(
      document,
      new KeyboardEvent('keyup', {
        altKey: true,
        key: 'ArrowRight',
      }),
    );

    await waitFor(() => expect(window.location.pathname).toBe('/other'));
  });
});

function TestComponent(): React.JSX.Element {
  useKeyboardNavigation();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          Component={() => <Link to="/other">Visit Another Page</Link>}
        />
        <Route path="/other" />
      </Routes>
    </BrowserRouter>
  );
}
