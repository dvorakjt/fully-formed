import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSubmitted } from '../../hooks';
import { Field, StringValidators } from '../../model';

describe('useSubmitted()', () => {
  afterEach(cleanup);

  test(`It returns a React state variable of type boolean that is updated when 
  the state.submitted property of the entity it received changes.`, async () => {
    const invalidMessage = 'Field is required.';

    const field = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage,
        }),
      ],
    });

    function TestComponent(): React.JSX.Element {
      const submitted = useSubmitted(field);

      return (
        <form>
          {submitted && (
            <div>
              {field.state.messages.map((message, index) => {
                return <span key={index}>{message.text}</span>;
              })}
            </div>
          )}
          <button
            onClick={e => {
              e.preventDefault();
              field.setSubmitted();
            }}
          >
            Submit
          </button>
        </form>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);
    expect(screen.queryByText(invalidMessage)).toBeNull();

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);
    await waitFor(() =>
      expect(screen.queryByText(invalidMessage)).not.toBeNull(),
    );

    field.reset();
    await waitFor(() => expect(screen.queryByText(invalidMessage)).toBeNull());
  });
});
