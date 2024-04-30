import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Field, StringValidators, Validity } from '../../model';
import { useValidity } from '../../hooks';

describe('useValidity()', () => {
  afterEach(cleanup);

  test(`It returns the validity of an instance of a class that implements 
  Stateful<State>. The value it returns is updated when the validity of that 
  instance changes.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    function TestComponent(): React.JSX.Element {
      const validity = useValidity(field);

      return <p data-testid="validity">{validity}</p>;
    }

    render(<TestComponent />);
    const validity = screen.queryByTestId('validity');
    expect(validity?.textContent).toBe(Validity.Invalid);

    field.setValue('test');
    await waitFor(() => expect(validity?.textContent).toBe(Validity.Valid));
  });
});
