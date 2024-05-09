import React, { useState } from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTemplate, FormFactory } from '../../model';
import { ObjectIdMap } from '../../test-utils';
import { useForm } from '../../hooks';

describe('useForm()', () => {
  afterEach(cleanup);

  class Template extends FormTemplate {
    public readonly formElements = [];
  }

  const Form = FormFactory.createForm(Template);

  test('It returns the same form instance across re-renders.', async () => {
    const objectIdMap = new ObjectIdMap();
    let renders = 0;

    function TestComponent(): React.JSX.Element {
      renders++;
      const form = useForm(new Form());
      const [counter, setCounter] = useState(0);

      return (
        <>
          <p data-testid="form-object-id">{objectIdMap.get(form)}</p>
          <button
            data-testid="increment"
            onClick={() => setCounter(counter + 1)}
          >
            Increment Counter
          </button>
        </>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);
    expect(screen.getByTestId('form-object-id').textContent).toBe('0');
    expect(renders).toBe(1);

    const incrementCount = screen.getByTestId('increment');
    await user.click(incrementCount);
    expect(renders).toBe(2);
    expect(screen.getByTestId('form-object-id').textContent).toBe('0');
  });

  test('Each call returns a unique form instance.', () => {
    const objectIdMap = new ObjectIdMap();

    function TestComponent(): React.JSX.Element {
      const formA = useForm(new Form());
      const formB = useForm(new Form());

      return (
        <>
          <p data-testid="form-A-object-id">{objectIdMap.get(formA)}</p>
          <p data-testid="form-B-object-id">{objectIdMap.get(formB)}</p>
        </>
      );
    }

    render(<TestComponent />);

    expect(screen.getByTestId('form-A-object-id').textContent).toBe('0');
    expect(screen.getByTestId('form-B-object-id').textContent).toBe('1');
  });
});
