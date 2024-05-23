import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useUserInput } from '../../hooks';
import { Field } from '../../model';

describe('useUserInput()', () => {
  afterEach(cleanup);

  test(`It returns an object that, when spread into the props of an input
  element, converts that input into a controlled input.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: 'test',
    });

    const inputId = 'input';

    function Input(): React.JSX.Element {
      return <input data-testid={inputId} {...useUserInput(field)} />;
    }

    const user = userEvent.setup();
    render(<Input />);

    const input = screen.getByTestId(inputId) as HTMLInputElement;
    expect(input.value).toBe('test');

    await user.clear(input);
    await waitFor(() => expect(input.value).toBe(''));
    expect(field.state.value).toBe('');

    await user.type(input, 'hello world');
    await waitFor(() => expect(input.value).toBe('hello world'));
    expect(field.state.value).toBe('hello world');
  });
});
